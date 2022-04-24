import {Order} from "models/order/Order"
import {OrderPayment} from "models/order/OrderPayment"
import {OrderProductColor} from "models/order/OrderProductColor"
import {OrderAdditionalService} from "models/order/OrderAdditionalService"
import {OrderAddress} from "models/order/OrderAddress"
import OrderEvents from "app/events/OrderEvents"
import ProductColorService from "services/product/ProductColorService"
import ClientService from "services/client/ClientService"
import OrderQueue from "jobs/OrderQueue"
import {raw} from "objection"

/**
 * Вывод сделки
 * @returns
 */
const SelectOrderForAdminRef = () => {
    return Order.query()
        .withGraphFetched(`[client, payments, user, additionalServices]`)
        .select(
            "id",
            "total_price",
            "promo_code",
            "status_id",
            "position",
            "created_at",
            "discount",
            "payment_state"
        )
}

/**
 * Вывод сделки
 * @returns
 */
const SelectOrderRef = () => {
    return Order.query()
        .withGraphFetched(`[client, payments, additionalServices]`)
        .select(
            "id",
            "total_price",
            "promo_code",
            "status_id",
            "position",
            "created_at",
            "discount",
            "payment_state"
        )
}

/**
 * Создание сделки
 * @param {additionalServices, status_id, client, source_id, delivery_id, processing, payments, total_price, discount, address} data
 * @param config
 */
const Create = async (data: any, config?: any) => {
    let {
        type = "pos",
        additionalServices,
        status_id = 1,
        client,
        source_id,
        delivery_id,
        payments,
        total_price,
        promo_code,
        discount,
        payment_state,
        products,
        user_id,
        processing,
        created_at,
        address,
        client_source_id,
        client_source_comment
    } = data

    let client_id = null
    let position: null

    // Последняя сделка
    const lastOrder = await Order.query<any>().orderBy("position", "desc").findOne({status_id})
    position = lastOrder ? lastOrder.position + 1 : 0

    // Поиск клиента
    if (client) {
        if (client.id) client_id = client.id
        else if (client.phone) {
            const selClient: any = await ClientService.FindOrCreateClientByPhone(client.phone, client)
            if (selClient) client_id = selClient.id
        }
    }

    // Создание сделки
    const order = await Order.query<any>().insertAndFetch({
        type,
        client_id,
        status_id,
        source_id,
        delivery_id,
        total_price,
        promo_code,
        discount,
        user_id,
        payment_state,
        processing,
        position,
        client_source_id,
        client_source_comment,
        created_at
    })

    if (order) {
        if (client)
            // Запуск действия
            OrderEvents.eventEmitter.emit("create_order_event", {
                status_id,
                client,
                order_id: order.id
            })

        if (address)
            // Очередь на добавление адреса к сделке
            // OrderQueue.AddAddressToOrder.add({orderId: order.id, information: address})
            await AddAddressToOrder(order.id, address)

        if (products)
            // Очередь на добавление продуктов к сделке
            // OrderQueue.AddProductsToOrder.add({orderId: order.id, products})
            await AddProductsToOrder(order.id, products)

        if (additionalServices)
            //
            // OrderQueue.AddAdditionalServiceToOrder.add({orderId: order.id, additionalServices})
            await AddAdditionalServicesToOrder(order.id, additionalServices)

        if (payments)
            //
            // OrderQueue.AddPaymentsToOrder.add({orderId: order.id, payments})
            await AddPaymentsToOrder(order.id, payments)

        if (config && config.timer)
            // Добавить таймер для отмены сделки
            OrderQueue.AddTimerForCancelOrder(order.id)
    }

    return order
}

const EditById = async (id, data) => {
    let {
        additionalServices,
        client,
        delivery_id,
        payments,
        total_price,
        promo_code,
        discount,
        products,
        processing,
        created_at,
        address
    } = data

    let client_id = null

    // Поиск клиента
    if (client) {
        if (client.id) client_id = client.id
        else if (client.phone) {
            const selClient: any = await ClientService.FindOrCreateClientByPhone(client.phone, client)
            if (selClient) client_id = selClient.id
        }
    }

    //
    const order = await Order.query<any>().updateAndFetchById(id, {
        client_id,
        delivery_id,
        total_price,
        promo_code,
        discount,
        processing,
        created_at
    })

    if (order) {
        if (address)
            // Очередь на добавление адреса к сделке
            // OrderQueue.AddAddressToOrder.add({orderId: id, information: address})
            await AddAddressToOrder(id, address)

        if (products)
            // Очередь на добавление продуктов к сделке
            // OrderQueue.AddProductsToOrder.add({orderId: id, products})
            await AddProductsToOrder(id, products)

        if (additionalServices)
            //
            // OrderQueue.AddAdditionalServiceToOrder.add({orderId: id, additionalServices})
            await AddAdditionalServicesToOrder(id, additionalServices)

        if (payments)
            //
            // OrderQueue.AddPaymentsToOrder.add({orderId: id, payments})
            await AddPaymentsToOrder(id, payments)
    }
    return order
}

/**
 * Добавить доп. услуги к сделке
 * @param {*} orderId
 * @param {*} additionalServices
 * @returns
 */
const AddAdditionalServicesToOrder = async (orderId, additionalServices) => {
    // TODO - удаление на редактирование
    await OrderAdditionalService.query().where({order_id: orderId}).delete()
    additionalServices.map(
        async additionalService =>
            await OrderAdditionalService.query<any>().insert({
                order_id: orderId,
                title: additionalService.title,
                price: additionalService.price,
                qty: additionalService.qty
            })
    )
}

/**
 * Добавить оплата к сделке
 * @param {*} orderId
 * @param payments
 * @returns
 */
const AddPaymentsToOrder = async (orderId, payments) => {
    // TODO - удаление на редактирование
    await OrderPayment.query<any>().where({order_id: orderId}).delete()
    payments.map(
        async payment =>
            await OrderPayment.query<any>().insert({
                order_id: orderId,
                payment_id: payment.payment_id,
                price: payment.price
            })
    )
}

/**
 * Добавить адрес к сделке
 * @param {*} orderId
 * @param {*} information
 * @returns
 */
const AddAddressToOrder = async (orderId, information) => {
    const checkPrevAddress = await OrderAddress.query<any>().findOne({order_id: orderId})

    if (checkPrevAddress)
        await OrderAddress.query<any>().findById(checkPrevAddress.id).update({
            full_name: information.full_name,
            phone: information.phone,
            country: information.country,
            city: information.city,
            address: information.address,
            position: information.position
        })
    else
        await OrderAddress.query<any>().insert({
            order_id: orderId,
            full_name: information.full_name,
            phone: information.phone,
            country: information.country,
            city: information.city,
            address: information.address,
            position: information.position
        })
}

/**
 * Добавить товары к сделке
 * @param {*} orderId
 * @param {*} products
 * @returns
 */
const AddProductsToOrder = async (orderId, products) => {
    const checkPrevProductColors = await OrderProductColor.query<any>().where({order_id: orderId})

    if (checkPrevProductColors) {
        await Promise.all(
            checkPrevProductColors.map(
                async product =>
                    await ProductColorService.PlusQtyProductColor(
                        product.product_color_id,
                        product.size_id,
                        product.qty
                    )
            )
        )

        await OrderProductColor.query().where({order_id: orderId}).delete()
    }

    return Promise.all(
        products.map(async product => {
            const sizeId = product.size ? product.size.id : product.size_id

            // Создание ордера
            await OrderProductColor.query<any>().insert({
                product_color_id: product.id,
                order_id: orderId,
                size_id: sizeId,
                qty: product.qty,
                price: product.price,
                promotion: product.promotion,
                discount: product.discount && product.discount.discount
            })
            // Изменения остатка
            await ProductColorService.MinusQtyProductColor(product.id, sizeId, product.qty)
        })
    )
}

/**
 * Изменить статус и позищию сделки
 * @param {*} param0
 * @returns
 */
const UpdateStatusAndPosition = async ({order_id, status_id, prev_position, prev_status_id, position}) => {
    if (status_id) {
        await Order.query<any>().updateAndFetchById(order_id, {status_id, position})
        await Order.query<any>()
            .where("status_id", status_id)
            .where("position", ">=", position)
            .whereNot({id: order_id})
            .update({position: raw("position + 1")})
        await Order.query<any>()
            .where("status_id", prev_status_id)
            .where("position", ">=", prev_position)
            .update({position: raw("position - 1")})
    } else {
        const order = await Order.query<any>().updateAndFetchById(order_id, {position})
        if (position < prev_position) {
            await Order.query<any>()
                .where("status_id", order.status_id)
                .where("position", ">=", position)
                .where("position", "<=", prev_position)
                .whereNot({id: order_id})
                .update({position: raw("position + 1")})
        } else if (position > prev_position) {
            await Order.query<any>()
                .where("status_id", order.status_id)
                .where("position", ">=", prev_position)
                .where("position", "<=", position)
                .whereNot({id: order_id})
                .update({position: raw("position - 1")})
        }
    }

    const ref = SelectOrderRef()
    return ref.findById(order_id)
}

const UpdateStatusAndPositionQueue = ({order_id, status_id, prev_position, prev_status_id, position}) => {
    // @ts-ignore
    OrderQueue.UpdateStatusAndPositionToOrder({
        order_id,
        status_id,
        prev_position,
        prev_status_id,
        position
    })
}

/**
 * Таймер для отмены заказа
 * @param {*} orderId
 */
const AddTimerForCancelOrder = async orderId => {
    const order = await Order.query<any>().findById(orderId)
    if (order.payment_state === 0)
        // Отмена сделки
        await Order.query<any>().findById(orderId).update({payment_state: -1})
}

export default {
    Create,
    EditById,
    AddProductsToOrder,
    AddAddressToOrder,
    AddAdditionalServicesToOrder,
    SelectOrderRef,
    SelectOrderForAdminRef,
    UpdateStatusAndPosition,
    UpdateStatusAndPositionQueue,
    AddPaymentsToOrder,
    AddTimerForCancelOrder
}
