import {ProductColor} from "models/product/ProductColor"
import {ProductSize} from "models/product/ProductSize"

/**
 * Найти цвета по продукту
 * @param productId
 * @return {Promise<*>}
 * @constructor
 */
const FindProductColorsByProductId = async productId => {
    return await ProductColor.query()
        .withGraphFetched(
            `[
                details(),
                tags(),
                color(),
                discount(),
                category(),
            ]`
        )
        .where("product_id", productId)
        .select(
            "product_colors.id",
            "product_colors.thumbnail",
            "product_colors.created_at",
            "sizes"
        )
}

/**
 * Создание или изменения
 * @param colors
 * @param productId
 * @return {Promise<unknown[]>}
 * @constructor
 */
const CreateOrUpdate = async (colors, productId) => {
    return await Promise.all(
        colors.map(async color => {
            if (color.id) {
                await ProductColor.query<any>().findById(color.id).update({
                    sizes: color.props,
                    product_id: productId,
                    color_id: color.color_id
                })
            } else {
                await ProductColor.query<any>().insert({
                    sizes: color.props,
                    product_id: productId,
                    color_id: color.color_id
                })
            }
        })
    )
}

/**
 * Минусовать товар
 * @param productColorId
 * @param sizeId
 * @param qty
 * @return {Promise<number>}
 * @constructor
 */
const MinusQtyProductColor = async (productColorId, sizeId, qty) => {
    const productSize = await ProductSize.query<any>().findOne({
        product_color_id: productColorId,
        size_id: sizeId
    })
    const totalQty = productSize.qty - qty
    // TODO - Уведомления
    if (productSize.min_qty >= totalQty) {
        const isActive = await ProductSize.query<any>().where({product_color_id: productColorId})
            .where("qty", ">", 0)
        //
        if (!isActive) {
            await ProductColor.query<any>().findById(productColorId)
                .where("status", "=", "published")
                .update({status: "ending"})
        }
    }
    await ProductSize.query<any>()
        .findById(productSize.id)
        .patch({qty: totalQty})
    // Вывод остатка
    return totalQty
}

/**
 * Плюсовать товар
 * @param productColorId
 * @param sizeId
 * @param qty
 * @return {Promise<number>}
 * @constructor
 */
const PlusQtyProductColor = async (productColorId, sizeId, qty) => {
    const productSize = await ProductSize.query<any>().findOne({
        product_color_id: productColorId,
        size_id: sizeId
    })
    const totalQty = productSize.qty + qty
    await ProductSize.query<any>()
        .findById(productSize.id)
        .patch({qty: totalQty})
    // Вывод остатка
    return totalQty
}

export default {
    CreateOrUpdate,
    FindProductColorsByProductId,
    MinusQtyProductColor,
    PlusQtyProductColor
}
