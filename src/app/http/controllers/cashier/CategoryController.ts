import {Category} from "models/settings/Category"

// Вывод всех категорий
const GetAll = async (req, res) => {
    const categories = await Category.query()
        .where({category_id: null})
        .modify("onlyActiveCategories")
        .withGraphFetched("[sub_categories(onlyActiveSubCategories)]")
        .select("id", "title")

    return res.send(categories)
}

export default {GetAll}
