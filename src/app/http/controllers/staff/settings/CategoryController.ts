import {Category} from "models/settings/Category"
import {Product} from "models/product/Product"
import {map} from "lodash/fp"

/**
 * Вывод активных
 * @param {*} req
 * @param {*} res
 * @returns
 */
const GetByActive = async (req, res) => {
    const subCategories = await Category.query<any>()
        .whereNull("hide_id")
        .whereNotNull("category_id")
        .select("category_id")
        .distinct("category_id")
        .then(map("category_id"))

    const categories = await Category.query<any>()
        .whereNull("hide_id")
        .withGraphFetched("[sub_categories()]")
        .whereIn("id", subCategories)
        .select("id", "title")

    return res.send(categories)
}

const GetByFilter = async (req, res) => {
    const categories = await Category.query()
        .where({category_id: null})
        .modify("onlyActiveCategories")
        .withGraphFetched("[sub_categories(onlyActiveSubCategories)]")
        .select("id", "title")

    return res.send(categories)
}

/**
 * Создать категорию
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    const data = req.body
    let category = await Category.query<any>()
        .select("id", "title")
        .insertAndFetch(data)

    if (data.category_id)
        category = await Category.query()
            .withGraphFetched("[sub_categories()]")
            .select("id", "title", "url", "hide_id")
            .findById(data.category_id)

    return res.send(category)
}

/**
 * Редактировать категорию
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Edit = async (req, res) => {
    const {id} = req.params

    const data = req.body
    let category = await Category.query<any>()
        .select("id", "title", "url", "hide_id")
        .updateAndFetchById(id, data)

    if (data.category_id)
        category = await Category.query()
            .withGraphFetched("[sub_categories()]")
            .select("id", "title", "url", "hide_id")
            .findById(data.category_id)

    return res.send(category)
}

/**
 * Удаление категории
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Delete = async (req, res) => {
    const {id} = req.params
    const category = await Category.query<any>().findById(id)

    if (category.category_id) {
        const products = await Product.query().where("category_id", id)
        if (products.length)
            return res.status(500).send({
                message:
                    "Невозможно удалить! У данной категории есть товары!"
            })
    } else {
        const products = await Product.query().whereRaw(
            `category_id IN (SELECT id FROM categories WHERE category_id = ${category.id})`
        )
        if (products.length)
            return res.status(500).send({
                message:
                    "Невозможно удалить! У данной категории есть товары!"
            })
    }

    await Category.query().deleteById(id)

    const categories = await Category.query()
        .where({category_id: null})
        .withGraphFetched("[sub_categories()]")
        .select("id", "title", "url", "hide_id")

    return res.send(categories)
}

export default {Create, Edit, Delete, GetByActive, GetByFilter}
