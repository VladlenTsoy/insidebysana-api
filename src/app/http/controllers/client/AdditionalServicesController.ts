import {AdditionalService} from "models/settings/AdditionalService"

/**
 * Вывод всех доп. услуг
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const additionalServices = await AdditionalService.query()
        .whereRaw(`JSON_SEARCH(display, 'all', 'site') > 0`)
        .select("id", "title", "price", "image")
    return res.send(additionalServices)
}

export default {GetAll}
