import {PrintCategory} from "models/print/PrintCategory"

/**
 * Вывод всех категорий
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const printCategories = await PrintCategory.query()
        .where({category_id: null})
        .withGraphFetched("[sub_categories()]")
        .select("id", "title", "hide_id", "image")
    return res.send(printCategories)
}

export default {GetAll}
