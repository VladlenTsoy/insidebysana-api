import {Client} from "models/Client"
import {Cart} from "models/Cart"
import {ProductColor} from "models/product/ProductColor"
import {Wishlist} from "models/Wishlist"
import moment from "moment"
import {Size} from "models/settings/Size"
import {Order} from "models/order/Order"
import {raw} from "objection"

/**
 * Вывод клиентов
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAllPaginate = async (req, res) => {
    const {search, pagination, sorter} = req.body
    const order = sorter.order === "ascend" ? "asc" : "desc"

    const clients = await Client.query()
        .join("orders", "orders.client_id", "clients.id")
        .select("clients.*", raw("(SUM(orders.total_price) / (SELECT SUM(`orders`.`total_price`) FROM `orders`)) * 100 as percent"))
        .withGraphFetched(`[source]`)
        .modify("search", search)
        .orderBy(`${sorter.field}`, order)
        .groupBy("clients.id")
        .page(pagination.page, pagination.pageSize)

    return res.send(clients)
}

/**
 * Вывод клиента
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetById = async (req, res) => {
    const {id} = req.params
    const client = await Client.query().withGraphFetched(`source`).findById(id)

    return res.send(client)
}

/**
 * Вывод по поиску
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetBySearch = async (req, res) => {
    const {search} = req.body

    const clients = await Client.query()
        .select("id", "full_name", "email", "phone")
        .modify("search", search)

    return res.send(clients)
}

/**
 * Создание клиента
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    const body = req.body

    const client = await Client.query()
        .withGraphFetched(
            `[
                source(),
            ]`
        )
        .insert(body)

    return res.send(client)
}

/**
 * Редактирование клиента
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Edit = async (req, res) => {
    const {id} = req.params
    const body = req.body

    if (body.date_of_birth) body.date_of_birth = moment(body.date_of_birth).format("YYYY-MM-DD")

    const client = await Client.query()
        .withGraphFetched(
            `[
                source(),
            ]`
        )
        .updateAndFetchById(id, body)

    return res.send(client)
}

const GetProductsByCart = async (req, res) => {
    const {id} = req.params
    const cart = await Cart.query<any>().where({user_id: id})
    const responseProducts: any[] = []

    await Promise.all(
        cart.map(async val => {
            const [productColorId, sizeId] = val.sku.match(/\d+/g)

            if (productColorId && sizeId) {
                let product = await ProductColor.query<any>()
                    .withGraphFetched(`[discount, color]`)
                    .join("products", "products.id", "product_colors.product_id")
                    .findOne({"product_colors.hide_id": null, "product_colors.id": productColorId})
                    .select(
                        "product_colors.id",
                        "product_colors.thumbnail",
                        "product_colors.title",
                        "products.category_id",
                        "products.price"
                    )
                if (product) {
                    product.sku = val.sku
                    product.qty = val.qty
                    const size = await Size.query()
                        .join(
                            `product_colors`,
                            raw(
                                `JSON_EXTRACT(product_colors.sizes, concat('$."',sizes.id,'".qty')) > 0`
                            )
                        )
                        .findById(sizeId)
                        .select(
                            "sizes.id",
                            "sizes.title",
                            raw(
                                `JSON_EXTRACT(product_colors.sizes, concat('$."',sizes.id,'".qty')) as qty`
                            )
                        )
                    if (size) {
                        product.size = size
                        responseProducts.push(product)
                    }
                }
            }
        })
    )

    return res.send(responseProducts)
}

const GetProductsByWishlist = async (req, res) => {
    const {id} = req.params
    const wishlist = await Wishlist.query<any>().where({user_id: id})
    let responseProducts: any[] = []

    if (wishlist) {
        const wishlistProductColorIds = wishlist.map(item => item.product_color_id)
        responseProducts = await ProductColor.query()
            .withGraphFetched(`[discount, color]`)
            .join("products", "products.id", "product_colors.product_id")
            .where("product_colors.hide_id", null)
            .whereIn("product_colors.id", wishlistProductColorIds)
            .select(
                "product_colors.id",
                "product_colors.thumbnail",
                "product_colors.title",
                "products.category_id",
                "products.price"
            )
    }

    return res.send(responseProducts)
}

const GetOrdersByClientId = async (req, res) => {
    const {id} = req.params

    const orders = await Order.query()
        .withGraphFetched(`[payments, user, status]`)
        .where({client_id: id})
        .orderBy("created_at", "desc")
        .select("id", "total_price", "created_at", "payment_state")

    return res.send(orders)
}

export default {
    GetAllPaginate,
    Create,
    GetBySearch,
    Edit,
    GetProductsByCart,
    GetProductsByWishlist,
    GetOrdersByClientId,
    GetById
}
