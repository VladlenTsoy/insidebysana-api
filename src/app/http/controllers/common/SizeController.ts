import {Size} from "models/settings/Size"

/**
 * Вывод всех размеров
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const sizes = await Size.query().select("id", "title")
    return res.send(sizes)
}

export default {GetAll}
