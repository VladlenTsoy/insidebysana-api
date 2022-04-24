import {ProductHomePosition} from "models/product/ProductHomePosition"
import {ProductColor} from "models/product/ProductColor"

/**
 * Вывод всех продуктов для дом. страницы
 * @returns
 */
const GetAll = async (req, res) => {
    const homeProducts = await ProductHomePosition.query<any>().orderBy("position", "desc")
    const ids = homeProducts.map(product => product.product_color_id)

    const products = await ProductColor.query<any>()
        .join("products", "products.id", "product_colors.product_id")
        .join("colors", "colors.id", "product_colors.color_id")
        .join("product_home_positions", "product_home_positions.product_color_id", "product_colors.id")
        .whereRaw(`product_colors.id IN (SELECT product_home_positions.product_color_id FROM product_home_positions)`)
        .orderByRaw(`FIELD(product_colors.id, ${ids.reverse().join(",")})`)
        .select(
            "product_home_positions.id",
            "product_home_positions.product_color_id",
            "product_colors.thumbnail",
            "products.title",
            "products.price",
            "product_home_positions.position",
            "colors.title as color_title"
        )
    return res.send(products)
}

/**
 * Добавить продукт для дом. страницы
 * @param {*} req
 * @param {*} res
 * @returns
 */
const Create = async (req, res) => {
    const {product_color_id, position} = req.body
    await ProductHomePosition.query<any>().insert({product_color_id, position})
    const product = await ProductColor.query()
        .join("products", "products.id", "product_colors.product_id")
        .join("colors", "colors.id", "product_colors.color_id")
        .join("product_home_positions", "product_home_positions.product_color_id", "product_colors.id")
        .findOne("product_colors.id", product_color_id)
        .select(
            "product_home_positions.id",
            "product_home_positions.product_color_id",
            "product_colors.thumbnail",
            "products.title",
            "products.price",
            "product_home_positions.position",
            "colors.title as color_title"
        )
    return res.send(product)
}

/**
 * Изменить продукт для дом. страницы
 * @param {*} req
 * @param {*} res
 * @returns
 */
const Edit = async (req, res) => {
    const {id} = req.params
    const {product_color_id, position} = req.body
    await ProductHomePosition.query<any>().updateAndFetchById(id, {product_color_id, position})
    const product = await ProductColor.query()
        .join("products", "products.id", "product_colors.product_id")
        .join("colors", "colors.id", "product_colors.color_id")
        .join("product_home_positions", "product_home_positions.product_color_id", "product_colors.id")
        .findOne("product_colors.id", product_color_id)
        .select(
            "product_home_positions.id",
            "product_home_positions.product_color_id",
            "product_colors.thumbnail",
            "products.title",
            "products.price",
            "product_home_positions.position",
            "colors.title as color_title"
        )
    return res.send(product)
}

/**
 * Удалить продукт с дом. страницы
 * @param {*} req
 * @param {*} res
 * @returns
 */
const Delete = async (req, res) => {
    const {id} = req.params
    await ProductHomePosition.query().deleteById(id)
    return res.send({status: "success"})
}

const GetFree = async (req, res) => {
    const {position} = req.params
    const positions = await ProductHomePosition.query<any>().pluck("position")
    const allPositions = Array.from({length: 24}, (_, i) => i + 1)
    const freePositions = allPositions.filter(
        _position => (position !== 0 && _position === Number(position)) || !positions.includes(_position)
    )

    return res.send(freePositions)
}

export default {GetAll, Create, Delete, Edit, GetFree}
