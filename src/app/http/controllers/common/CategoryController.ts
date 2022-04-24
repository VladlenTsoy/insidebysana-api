import {Category} from "models/settings/Category"

/**
 * Вывод всех категорий
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const categories = await Category.query()
        .where({category_id: null})
        .withGraphFetched("[sub_categories()]")
        .select("id", "title", "url", "hide_id")
    return res.send(categories)
}

export default {GetAll}
