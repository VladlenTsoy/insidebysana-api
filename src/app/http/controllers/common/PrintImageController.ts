import {PrintImage} from "models/print/PrintImage"

/**
 * Вывод всех категорий
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const printImages = await PrintImage.query()
        .where({hide_id: null})
        .withGraphFetched("[category]")
        .select("id", "title", "hide_id", "image", "price", "thumbnail")
    return res.send(printImages)
}

/**
 * Вывод
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetByCategoryID = async (req, res) => {
    const {category_id} = req.params
    const printImages = await PrintImage.query()
        .where({hide_id: null, category_id})
        .withGraphFetched("[category]")
        .select("id", "title", "hide_id", "image", "price", "thumbnail")
    return res.send(printImages)
}

export default {GetAll, GetByCategoryID}
