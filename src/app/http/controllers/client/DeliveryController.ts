import {Delivery} from "models/settings/Delivery"

/**
 * Вывод доставки
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetByCountry = async (req, res) => {
    const {country} = req.body
    const deliveries = await Delivery.query().orderBy("created_at", "asc").where({country_id: country})

    return res.send(deliveries)
}

export default {GetByCountry}
