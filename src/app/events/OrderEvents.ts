import events from "events"
import {SendMessageQueue} from "jobs/SendMessageQueue"
import {Status} from "models/order/Status"
import {io} from "config/socket.config"
import * as SMSTemplateService from "services/SMSTemplateService"

const eventEmitter = new events.EventEmitter()

/**
 * События при создании сделки
 * @param {*} param0
 */
const CreateHandler = async ({status_id, client, order_id}) => {
    if (!order_id) return

    const OrderService = require("services/order/OrderService")
    const ref = OrderService.SelectOrderForAdminRef()
    const order = await ref.findById(order_id)

    if (!order) return

    // Уведомление для администраторов
    io.to("admins").emit("order_create", order)

    if (status_id && client) {
        // Вывод статуса
        const status = await Status.query<any>().findById(status_id)
        if (status && Array.isArray(status.sms) && status.sms.length) {
            const smsAction = status.sms.find(sms =>
                sms.payment_state.includes(String(order.payment_state))
            )

            if (smsAction) {
                const updateMessage = SMSTemplateService.ReplaceVariablesToData(
                    smsAction.message,
                    order_id,
                    order.total_price,
                    client.full_name
                )

                console.log({
                    phone: client.phone,
                    message: updateMessage,
                    timeout: smsAction.timeout
                })

                if (updateMessage)
                    // Отправка сообщения
                    await SendMessageQueue({
                        phone: client.phone,
                        message: updateMessage,
                        timeout: smsAction.timeout
                    })
            }
        }
    }
}

eventEmitter.on("create_order_event", CreateHandler)

/**
 * События при изменении статуса оплаты
 * @param {*} param0
 */
const ChangePaymentStateHandler = async ({orderId, paymentState}) => {
    const OrderService = require("services/order/OrderService")
    const ref = OrderService.SelectOrderRef()
    const order = await ref.updateAndFetchById(orderId, {payment_state: paymentState})

    //
    io.emit("update_order", order)
}

eventEmitter.on("change_payment_state_order_event", ChangePaymentStateHandler)

/**
 *
 * @param {*} param0
 */
const UpdateStatusHandler = async ({orderId}) => {
    const OrderService = require("services/order/OrderService")
    const ref = OrderService.SelectOrderRef()
    const order = await ref.findById(orderId)

    //
    io.emit("event_update_order", order)
}

eventEmitter.on("update_status_order_event", UpdateStatusHandler)

export default {eventEmitter}
