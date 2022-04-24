import {ProductColor} from "models/product/ProductColor"
import {Size} from "models/settings/Size"
import {Cart} from "models/Cart"
import {raw} from "objection"

/**
 * Вывод всей корзины
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const {skus} = req.body
    const responseProducts: any[] = []
    const responseSkus: any[] = []

    await Promise.all(
        skus.map(async (sku: any) => {
            if (typeof sku !== "string") return
            const [productColorId, sizeId]: any = sku.match(/\d+/g)
            if (productColorId && sizeId) {
                let product = await ProductColor.query<any>()
                    .withGraphFetched(
                        `[
                        discount(),
                        color(),                
                    ]`
                    )
                    .join(
                        "products",
                        "products.id",
                        "product_colors.product_id"
                    )
                    .findOne({
                        "product_colors.status": "published",
                        "product_colors.id": productColorId
                    })
                    .select(
                        "product_colors.id",
                        "product_colors.thumbnail",
                        "product_colors.title",
                        "products.category_id",
                        "products.price"
                    )
                if (product) {
                    product.sku = sku
                    responseSkus.push(sku)
                    product.qty = 1
                    const size = await Size.query()
                        .join(
                            `product_colors`,
                            raw(
                                `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
                            )
                        )
                        .findById(sizeId)
                        .select(
                            "sizes.id",
                            "sizes.title",
                            raw(
                                `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
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

    return res.send({
        skus: responseSkus,
        products: responseProducts
    })
}

const Add = async (req, res) => {
    const user = req.user
    const {sku} = req.body

    await Cart.query<any>().insert({sku, user_id: user.id})

    return res.send({status: "success"})
}

const Remove = async (req, res) => {
    const user = req.user
    const {sku} = req.body

    await Cart.query<any>().where({sku, user_id: user.id}).delete()

    return res.send({status: "success"})
}

const UpdateQty = async (req, res) => {
    const user = req.user
    const {sku, qty} = req.body

    await Cart.query<any>().where({sku, user_id: user.id}).update({qty})

    return res.send({status: "success"})
}

const SyncAndGetAll = async (req, res) => {
    const user = req.user
    const {skus} = req.body

    const responseProducts: any[] = []
    const responseSkus: any[] = []

    await Promise.all(
        skus.map(async sku => {
            const checkCart = await Cart.query<any>().findOne({
                sku,
                user_id: user.id
            })

            if (!checkCart)
                await Cart.query<any>().insert({sku, user_id: user.id})
        })
    )

    const cartItems = await Cart.query<any>().where({user_id: user.id})

    if (cartItems)
        await Promise.all(
            cartItems.map(async ({sku, qty}) => {
                const [productColorId, sizeId] = sku.match(/\d+/g)

                if (productColorId && sizeId) {
                    let product = await ProductColor.query<any>()
                        .withGraphFetched(
                            `[
                        discount(),
                        color(),                
                    ]`
                        )
                        .join(
                            "products",
                            "products.id",
                            "product_colors.product_id"
                        )
                        .findOne({
                            "product_colors.status": "published",
                            "product_colors.id": productColorId
                        })
                        .select(
                            "product_colors.id",
                            "product_colors.thumbnail",
                            "product_colors.title",
                            "products.category_id",
                            "products.price"
                        )
                    if (product) {
                        product.sku = sku
                        responseSkus.push(sku)
                        product.qty = qty
                        const size = await Size.query()
                            .join(
                                `product_colors`,
                                raw(
                                    `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
                                )
                            )
                            .findById(sizeId)
                            .select(
                                "sizes.id",
                                "sizes.title",
                                raw(
                                    `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
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

    return res.send({
        skus: responseSkus,
        products: responseProducts
    })
}

/**
 * Clear
 * @param {*} req
 * @param {*} res
 * @returns
 */
const Clear = async (req, res) => {
    const user = req.user
    await Cart.query().where({user_id: user.id}).delete()

    return res.send({status: "success"})
}

export default {GetAll, Add, Remove, UpdateQty, SyncAndGetAll, Clear}
