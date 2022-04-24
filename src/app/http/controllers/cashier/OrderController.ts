import OrderService from "services/order/OrderService"
import {Order} from "models/order/Order"
import {Status} from "models/order/Status"
import moment from "moment"
import {raw} from "objection"

/**
 * Создание заказа
 * @param {*} req
 * @param {*} res
 * @returns
 */
const Create = async (req, res) => {
    const {
        payments,
        client,
        products,
        additionalServices,
        total_price,
        discount,
        processing,
        clientSourceId,
        clientSourceComment
    } = req.body
    const user = req.user

    let status = await Status.query<any>()
        .whereNotNull("conditions")
        .findOne(raw(`JSON_CONTAINS(conditions, '1', '$.payments_state') > 0`))
        .findOne(raw(`JSON_CONTAINS(conditions, '6', '$.source_ids') > 0`))
        .findOne(raw(`JSON_EXTRACT(conditions, '$.processing') = ${processing}`))

    // Создание сделки
    const order = await OrderService.Create({
        payments,
        additionalServices,
        client,
        discount,
        processing,
        products,
        total_price,
        // TODO - Почему 6
        source_id: 6,
        user_id: user.id,
        status_id: status ? status.id : null,
        payment_state: 1,
        client_source_id: clientSourceId,
        client_source_comment: clientSourceComment
    })

    const orderRef = OrderService.SelectOrderRef().withGraphFetched("[productColors]")
    const resOrder = await orderRef.findById(order.id)

    return res.send(resOrder)
}

/**
 * Вывод заказов
 * @param {*} req
 * @param {*} res
 * @returns
 */
const GetAll = async (req, res) => {
    const user = req.user
    const resOrders = await Order.query()
        .withGraphFetched(`[client, payments, productColors, additionalServices]`)
        .select(
            "id",
            "total_price",
            "promo_code",
            "status_id",
            "position",
            "created_at",
            "discount",
            "payment_state",
            "processing"
        )
        .orderBy("created_at", "desc")
        .where({user_id: user.id})
        .whereBetween("created_at", [
            moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            moment().endOf("day").format("YYYY-MM-DD HH:mm:ss")
        ])

    return res.send(resOrders)
}

export default {GetAll, Create}
