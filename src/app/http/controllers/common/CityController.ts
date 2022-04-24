import {City} from "models/settings/City"

/**
 * Вывод всех
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetByCountryId = async (req, res) => {
    const {countryId} = req.params
    const cities = await City.query()
        .where({country_id: countryId})
        .select("id", "name", "position", "country_id")
    return res.send(cities)
}

export default {GetByCountryId}
