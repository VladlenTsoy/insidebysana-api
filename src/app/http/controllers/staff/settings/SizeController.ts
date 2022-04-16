import {Size} from "models/settings/Size"
import {ProductColor} from "models/product/ProductColor"

/**
 * Создать цвет
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    const {title} = req.body
    const size = await Size.query<any>().insertAndFetch({title})

    return res.send(size)
}

/**
 * Редактировать цвет
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Edit = async (req, res) => {
    const {id} = req.params
    const {title} = req.body
    const size = await Size.query<any>().updateAndFetchById(id, {title})
    return res.send(size)
}

/**
 * Удаление
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Delete = async (req, res) => {
    const {id} = req.params
    const productColors = await ProductColor.query().whereRaw(
        `JSON_EXTRACT(sizes, '$."${id}".qty')`
    )

    if (productColors.length)
        return res.status(500).send({
            status: "warning",
            message: "Невозможно удалить! Данный размер используют!"
        })
    //
    else await Size.query().deleteById(id)

    return res.send({status: "success"})
}

/**
 * Скрыть цвет
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Hide = async (req, res) => {
    const {id} = req.params
    const user = req.user
    const size = await Size.query<any>().updateAndFetchById(id, {
        hide_id: user.id
    })
    return res.send(size)
}

/**
 * Отобразить цвет
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Display = async (req, res) => {
    const {id} = req.params
    const size = await Size.query<any>().updateAndFetchById(id, {hide_id: null})
    return res.send(size)
}

/**
 * Вывод размеров для фильтрация
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetByFilter = async (req, res) => {
    const sizes = await Size.query()
        .whereRaw(
            `id IN (SELECT product_sizes.size_id FROM product_sizes WHERE product_sizes.qty > 0)`
        )
        .select("id", "title")
    return res.send(sizes)
}

export default {Create, Hide, Display, Edit, Delete, GetByFilter}
