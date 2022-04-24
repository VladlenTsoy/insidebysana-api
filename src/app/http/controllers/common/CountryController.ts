import {Country} from "models/settings/Country"

/**
 * Вывод всех
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const countries = await Country.query().select("id", "name", "flag", "position")
    return res.send(countries)
}

export default {GetAll}
