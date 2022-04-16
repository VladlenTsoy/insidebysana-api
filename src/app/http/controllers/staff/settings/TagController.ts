import {Tag} from "models/settings/Tag"
import {Product} from "models/product/Product"

/**
 * Вывод всех тегов
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const tags = await Tag.query().select("id", "title")
    return res.send(tags)
}

/**
 * Редактировать тег
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Edit = async (req, res) => {
    const {id} = req.params
    const {title} = req.body

    const tag = await Tag.query<any>().updateAndFetchById(id, {title})
    return res.send(tag)
}

/**
 * Удаление тега
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Delete = async (req, res) => {
    const {id} = req.params
    const products = await Product.query().whereRaw(`JSON_CONTAINS(tags_id, '"${id}"')`)

    if (products.length)
        return res.status(500).send({message: "Невозможно удалить! Данный тег используют!"})
    else
        await Tag.query().deleteById(id)

    return res.send({status: "success"})
}

export default {GetAll, Edit, Delete}
