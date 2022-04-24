import {Category} from "models/settings/Category"

/**
 * Вывод всех категорий
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    //
    const categories = await Category.query()
        .modify("onlyActiveCategories")
        .where({category_id: null, hide_id: null})
        .select("id", "title", "url")

    return res.send(categories)
}

export default {GetAll}
