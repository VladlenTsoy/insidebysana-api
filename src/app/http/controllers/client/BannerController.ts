import {Banner} from "models/settings/Banner"

/**
 * Вывод баннеров
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const banners = await Banner.query()
        .orderBy("created_at", "desc")
        .select("id", "title", "image", "button_link", "button_title")

    return res.send(banners)
}

export default {GetAll}
