import {PaymentMethod} from "models/payment/PaymentMethod"

/**
 * Вывод всех методов оплаты
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const paymentMethods = await PaymentMethod.query()
    return res.send(paymentMethods)
}

export default {GetAll}
