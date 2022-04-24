import {ProductColor} from "models/product/ProductColor"
import {Wishlist} from "models/Wishlist"

/**
 * Вывод всего спика желаемого
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const {productColorIds} = req.body
    const products = await ProductColor.query()
        .withGraphFetched(`[discount, color]`)
        .join("products", "products.id", "product_colors.product_id")
        .whereIn("product_colors.id", productColorIds)
        .select(
            "product_colors.id",
            "product_colors.thumbnail",
            "product_colors.title",
            "products.category_id",
            "products.price"
        )

    return res.send({
        productColorIds,
        products
    })
}

/**
 * Сихронизация списка
 * @param {*} req
 * @param {*} res
 * @returns
 */
const SyncAndGetAll = async (req, res) => {
    const user = req.user
    const {productColorIds} = req.body

    let responseProductColorIds: any[] = []
    let responseProducts: any[] = []

    await Promise.all(
        productColorIds.map(async productColorId => {
            const checkWishlist = await Wishlist.query().findOne({
                product_color_id: productColorId,
                user_id: user.id
            })

            if (!checkWishlist)
                await Wishlist.query<any>().insert({
                    product_color_id: productColorId,
                    user_id: user.id
                })
        })
    )

    const wishlistItems = await Wishlist.query<any>().where({user_id: user.id})

    if (wishlistItems) {
        const wishlistProductColorIds = wishlistItems.map(
            wishlist => wishlist.product_color_id
        )
        responseProducts = await ProductColor.query()
            .withGraphFetched(
                `[
                    discount(),
                    color(),                
                ]`
            )
            .join("products", "products.id", "product_colors.product_id")
            // .where("product_colors.hide_id", null)
            .whereIn("product_colors.id", wishlistProductColorIds)
            .select(
                "product_colors.id",
                "product_colors.thumbnail",
                "product_colors.title",
                "products.category_id",
                "products.price"
            )

        responseProductColorIds = responseProducts.map(
            product => product.id
        )
    }

    return res.send({
        products: responseProducts,
        productColorIds: responseProductColorIds
    })
}

const Add = async (req, res) => {
    const user = req.user
    const {productColorId} = req.body

    await Wishlist.query<any>().insert({
        product_color_id: productColorId,
        user_id: user.id
    })

    return res.send({status: "success"})
}

const Remove = async (req, res) => {
    const user = req.user
    const {productColorId} = req.body

    await Wishlist.query()
        .where({product_color_id: productColorId, user_id: user.id})
        .delete()

    return res.send({status: "success"})
}

export default {GetAll, SyncAndGetAll, Add, Remove}
