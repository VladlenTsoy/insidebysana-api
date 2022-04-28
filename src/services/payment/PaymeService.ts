import {paymeLogger} from "config/logger.config"
import {PaymeTransaction} from "models/payment/PaymeTransaction"
import {Order} from "models/order/Order"
import moment from "moment"
import OrderEvents from "app/events/OrderEvents"
import {Request, Response} from "express"

export class PaymeService {
    PaymeException = {
        // Недостаточно привилегий для выполнения метода.
        ERROR_INSUFFICIENT_PRIVILEGE: -32504,
        // Ошибка системы
        ERROR_INTERNAL_SYSTEM: -32400,
        // Ошибка переданных данных ACCOUNT
        ERROR_INVALID_ACCOUNT: -31050,
        // Ошибка суммы AMOUNT
        ERROR_INVALID_AMOUNT: -31001,
        // Ошибка возникает если состояние транзакции, не позволяет выполнить операцию.
        ERROR_COULD_NOT_PERFORM: -31008,
        // Транзакция не найдена
        ERROR_TRANSACTION_NOT_FOUND: -31003,
        // Невозможно отменить транзакцию
        ERROR_COULD_NOT_CANCEL: -31007
    }

    PaymeExceptionMessage = {
        InvalidOrderCode: {
            ru: "Неверный код заказа.",
            uz: "Harid kodida xatolik.",
            en: "Incorrect order code."
        }
    }

    TransactionState = {
        STATE_CREATED: 1,
        STATE_COMPLETED: 2,
        STATE_CANCELLED: -1,
        STATE_CANCELLED_AFTER_COMPLETE: -2
    }

    TransactionReason = {
        REASON_RECEIVERS_NOT_FOUND: 1,
        REASON_PROCESSING_EXECUTION_FAILED: 2,
        REASON_EXECUTION_FAILED: 3,
        REASON_CANCELLED_BY_TIMEOUT: 4,
        REASON_FUND_RETURNED: 5,
        REASON_UNKNOWN: 10
    }
    private req: Request
    private res: Response
    private readonly params: any

    constructor(req, res) {
        this.req = req
        this.res = res
        this.params = req.body.params
    }

    // Вывод
    send(result) {
        try {
            const {jsonrpc, id} = this.req.body
            return this.res.send({jsonrpc, id, result})
        } catch (e) {
            if (e instanceof Error) paymeLogger.error(e.stack)
            return this.error(this.PaymeException.ERROR_INTERNAL_SYSTEM)
        }
    }

    // Вывод ошибки
    error(code, message: string | object | null = null, data = null) {
        const {jsonrpc, id} = this.req.body
        try {
            return this.res.send({jsonrpc, id, error: {code: code, message, data}})
        } catch (e) {
            if (e instanceof Error) paymeLogger.error(e.stack)
            return this.res.send({jsonrpc, id, error: {code: this.PaymeException.ERROR_INTERNAL_SYSTEM}})
        }
    }

    // Проверка транзакции
    async checkTransaction(find?: object) {
        if (find) return PaymeTransaction.query().findOne(find)

        const {id} = this.params
        return PaymeTransaction.query().findOne({paycom_transaction_id: id})
    }

    // Проверка таймаута транзакции
    async checkTransactionTimeout(create_time) {
        const createTime = moment(create_time)
        const now = moment(new Date())
        const duration = moment.duration(createTime.diff(now))
        const hours = duration.asHours()
        return hours > 12
    }

    // Конвертировать в тийны
    convertToTiyn(amount) {
        return Number(amount) * 100
    }

    // Проверка перед создание транзакции
    async CheckPerformTransaction() {
        try {
            const {account, amount} = this.params
            const order = await Order.query().findById(account.order_id)

            // Проверка сделки
            if (!order)
                return this.error(
                    this.PaymeException.ERROR_INVALID_ACCOUNT,
                    this.PaymeExceptionMessage.InvalidOrderCode,
                    account
                )

            // Проверка статуса оплаты у сделки
            if (order.payment_state !== 0)
                return this.error(this.PaymeException.ERROR_INVALID_ACCOUNT, "Order state is invalid.")

            // Сравнение суммы со сделкой
            if (this.convertToTiyn(order.total_price) !== Number(amount))
                return this.error(this.PaymeException.ERROR_INVALID_AMOUNT, "Incorrect amount.")

            // Вывод транзакции
            const transaction = await this.checkTransaction({order_id: account.order_id})
            if (
                transaction &&
                (transaction.state === this.TransactionState.STATE_CREATED ||
                    transaction.state === this.TransactionState.STATE_COMPLETED)
            )
                return this.error(
                    this.PaymeException.ERROR_COULD_NOT_PERFORM,
                    "There is other active/completed transaction for this order."
                )

            return this.send({allow: true})
        } catch (e) {
            if (e instanceof Error) paymeLogger.error(e.stack)
            return this.error(this.PaymeException.ERROR_INTERNAL_SYSTEM)
        }
    }

    // Создание транзакции
    async CreateTransaction() {
        try {
            const {account, amount, id, time} = this.params

            const order = await Order.query().findById(account.order_id)

            // Проверка сделки
            if (!order)
                return this.error(
                    this.PaymeException.ERROR_INVALID_ACCOUNT,
                    this.PaymeExceptionMessage.InvalidOrderCode,
                    account
                )

            // Проверка статуса оплаты у сделки
            if (order.payment_state !== 0)
                return this.error(this.PaymeException.ERROR_INVALID_ACCOUNT, "Order state is invalid.")

            // Сравнение суммы с сделкой
            if (this.convertToTiyn(order.total_price) !== Number(amount))
                return this.error(this.PaymeException.ERROR_INVALID_AMOUNT, "Incorrect amount.")

            // Предыдущая транзакция
            const previousTransaction = await this.checkTransaction({order_id: account.order_id})
            if (
                previousTransaction &&
                (previousTransaction.state === this.TransactionState.STATE_CREATED ||
                    previousTransaction.state === this.TransactionState.STATE_COMPLETED) &&
                previousTransaction.paycom_transaction_id !== id
            )
                return this.error(
                    this.PaymeException.ERROR_INVALID_ACCOUNT,
                    "There is other active/completed transaction for this order."
                )

            // Вывод транзакции
            const transaction = await this.checkTransaction()

            // Проверка транзакции
            if (!transaction) {
                // Проверка таймаут
                const checkTimeout = await this.checkTransactionTimeout(time)
                if (checkTimeout)
                    return this.error(this.PaymeException.ERROR_COULD_NOT_PERFORM, "Transaction is expired.")

                // Создание транзакции
                const createdTransaction = await PaymeTransaction.query().insertAndFetch({
                    order_id: account.order_id,
                    paycom_transaction_id: id,
                    paycom_time: time,
                    state: this.TransactionState.STATE_CREATED,
                    paycom_time_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    create_time: moment().format("YYYY-MM-DD HH:mm:ss")
                })

                return this.send({
                    state: createdTransaction.state,
                    create_time: Number(moment(createdTransaction.create_time).format("x")),
                    transaction: String(createdTransaction.id),
                    receivers: createdTransaction.receivers
                })
            }

            // Проверка состояния
            if (transaction.state !== this.TransactionState.STATE_CREATED)
                return this.error(
                    this.PaymeException.ERROR_COULD_NOT_PERFORM,
                    "Transaction found, but is not active."
                )

            // Проверка таймаута
            const checkTimeout = await this.checkTransactionTimeout(transaction.create_time)
            if (checkTimeout) {
                await PaymeTransaction.query().findById(transaction.id).update({
                    state: this.TransactionState.STATE_CREATED,
                    reason: this.TransactionReason.REASON_CANCELLED_BY_TIMEOUT
                })
                return this.error(this.PaymeException.ERROR_INVALID_ACCOUNT)
            }

            return this.send({
                state: transaction.state,
                create_time: Number(moment(transaction.create_time).format("x")),
                transaction: String(transaction.id),
                receivers: transaction.receivers
            })
        } catch (e) {
            if (e instanceof Error) paymeLogger.error(e.stack)
            return this.error(this.PaymeException.ERROR_INTERNAL_SYSTEM)
        }
    }

    // Зачисляет средства на счет
    async PerformTransaction() {
        try {
            // Вывод транзакции
            const transaction = await this.checkTransaction()
            // Проверка транзакции
            if (!transaction)
                return this.error(this.PaymeException.ERROR_TRANSACTION_NOT_FOUND, "Transaction not found.")

            // Оплачен
            if (transaction.state === this.TransactionState.STATE_COMPLETED)
                return this.send({
                    transaction: String(transaction.id),
                    state: transaction.state,
                    perform_time: Number(moment(transaction.perform_time).format("x"))
                })

            // Ошибка состояния
            if (transaction.state !== this.TransactionState.STATE_CREATED)
                return this.error(
                    this.PaymeException.ERROR_COULD_NOT_PERFORM,
                    "Could not perform this operation."
                )

            // Проверка таймаута
            const checkTimeout = await this.checkTransactionTimeout(transaction)
            if (checkTimeout)
                return this.error(this.PaymeException.ERROR_INVALID_ACCOUNT, "Transaction is expired.")

            // Обновление ордера
            await Order.query().findById(transaction.order_id).update({payment_state: 1})
            await OrderEvents.eventEmitter.emit("create_order_event", {
                orderId: transaction.order_id,
                paymentState: 1
            })

            // Обновить транзакцию
            const updatedTransaction = await PaymeTransaction.query().updateAndFetchById(transaction.id, {
                state: this.TransactionState.STATE_COMPLETED,
                perform_time: moment().format("YYYY-MM-DD HH:mm:ss")
            })

            return this.send({
                transaction: String(updatedTransaction.id),
                state: updatedTransaction.state,
                perform_time: Number(moment(updatedTransaction.perform_time).format("x"))
            })
        } catch (e) {
            if (e instanceof Error) paymeLogger.error(e.stack)
            return this.error(this.PaymeException.ERROR_INTERNAL_SYSTEM)
        }
    }

    // Отменить транзакцию
    async CancelTransaction() {
        try {
            const {reason} = this.params

            // Вывод транзакции
            const transaction = await this.checkTransaction()
            // Проверка транзакции
            if (!transaction)
                return this.error(this.PaymeException.ERROR_TRANSACTION_NOT_FOUND, "Transaction not found.")

            // Проверка состояния
            if (transaction.state === this.TransactionState.STATE_CREATED) {
                const updatedTransaction = await PaymeTransaction.query().updateAndFetchById(transaction.id, {
                    state: this.TransactionState.STATE_CANCELLED,
                    cancel_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                    reason
                })

                // Обновление ордера
                await Order.query().findById(transaction.order_id).update({payment_state: -1})
                OrderEvents.eventEmitter.emit("create_order_event", {
                    orderId: transaction.order_id,
                    paymentState: -1
                })

                return this.send({
                    transaction: String(updatedTransaction.id),
                    state: updatedTransaction.state,
                    cancel_time: Number(moment(updatedTransaction.cancel_time).format("x"))
                })
            }

            // Ошибка отмены
            if (transaction.state === this.TransactionState.STATE_COMPLETED) {
                const updatedTransaction = await PaymeTransaction.query().updateAndFetchById(transaction.id, {
                    state: this.TransactionState.STATE_CANCELLED_AFTER_COMPLETE,
                    cancel_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                    reason
                })

                // Обновление ордера
                await Order.query().findById(transaction.order_id).update({payment_state: -1})
                await OrderEvents.eventEmitter.emit("create_order_event", {
                    orderId: transaction.order_id,
                    paymentState: -1
                })

                return this.send({
                    transaction: String(updatedTransaction.id),
                    state: updatedTransaction.state,
                    cancel_time: Number(moment(updatedTransaction.cancel_time).format("x"))
                })
            }

            return this.send({
                transaction: String(transaction.id),
                state: transaction.state,
                cancel_time: Number(moment(transaction.cancel_time).format("x"))
            })
        } catch (e) {
            if (e instanceof Error) paymeLogger.error(e.stack)
            return this.error(this.PaymeException.ERROR_INTERNAL_SYSTEM)
        }
    }

    // Проверка транзакции
    async CheckTransaction() {
        try {
            // Вывод транзакции
            const transaction = await this.checkTransaction()
            // Проверка транзакции
            if (!transaction)
                return this.error(this.PaymeException.ERROR_TRANSACTION_NOT_FOUND, "Transaction not found.")

            return this.send({
                transaction: String(transaction.id),
                state: transaction.state,
                reason: transaction.reason,
                create_time: transaction.create_time
                    ? Number(moment(transaction.create_time).format("x"))
                    : 0,
                perform_time: transaction.perform_time
                    ? Number(moment(transaction.perform_time).format("x"))
                    : 0,
                cancel_time: transaction.cancel_time ? Number(moment(transaction.cancel_time).format("x")) : 0
            })
        } catch (e) {
            if (e instanceof Error) paymeLogger.error(e.stack)
            return this.error(this.PaymeException.ERROR_INTERNAL_SYSTEM)
        }
    }

    Auth() {
        try {
            const authorization = this.req.headers.authorization
            if (!authorization) return false
            const matches = authorization.match(/^\s*Basic\s+(\S+)\s*$/i)
            if (matches) {
                const buff = new Buffer(matches[1], "base64")
                return buff.toString("ascii") === `${process.env.PAYME_LOGIN}:${process.env.PAYME_KEY}`
            }
        } catch (e) {
            if (e instanceof Error) paymeLogger.error(e.stack)
        }
        return this.error(this.PaymeException.ERROR_INTERNAL_SYSTEM)
    }

    async Run() {
        const {method} = this.req.body

        const isAuth = this.Auth()
        if (!isAuth)
            return this.error(
                this.PaymeException.ERROR_INSUFFICIENT_PRIVILEGE,
                "Insufficient privilege to perform this method."
            )
        else {
            switch (method) {
                case "CheckPerformTransaction":
                    return await this.CheckPerformTransaction()
                case "CreateTransaction":
                    return await this.CreateTransaction()
                case "PerformTransaction":
                    return await this.PerformTransaction()
                case "CancelTransaction":
                    return await this.CancelTransaction()
                case "CheckTransaction":
                    return await this.CheckTransaction()
            }
        }
    }
}
