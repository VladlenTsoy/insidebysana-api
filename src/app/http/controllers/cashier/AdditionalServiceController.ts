import {AdditionalService} from "models/settings/AdditionalService"

/**
 * Вывод всех доп. услуг
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const additionalServices = await AdditionalService.query().whereRaw(
        `JSON_SEARCH(display, 'all', 'pos') > 0`
    )
    return res.send(additionalServices)
}

export default {GetAll}
