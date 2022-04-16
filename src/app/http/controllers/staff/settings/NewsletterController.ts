import {Newsletter} from "models/settings/Newsletter"

/**
 * Вывод всех подписанных на рассылку
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
        const newsletter = await Newsletter.query().select()
        return res.send(newsletter)
}

export default {GetAll}
