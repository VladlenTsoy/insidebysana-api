import {ProductColor} from "models/product/ProductColor"
import {ProductColorImage} from "models/product/ProductColorImage"
import {Product} from "models/product/Product"
import ImageService from "services/image/ImageService"

// Ссылка на папку с картинками
const IMAGES_FOLDER_PATH = "../../../public/images/products/"

/**
 * Вывод всех продуктов-цветов пагинация
 * @param req
 * @param res
 * @return {*}
 * @constructor
 */
const GetAllPaginate = async (req, res) => {
    const {
        type,
        categoryIds,
        sizeIds,
        search,
        pagination,
        sorter
    } = req.body
    const productColorsRef = ProductColor.query()
        .withGraphFetched(
            `[details, tags, color, discount, category, sizes]`
        )
        .modify("filterSubCategoryIn", categoryIds)
        .modify("filterSizes", sizeIds)
        .where(builder =>
            builder
                .whereRaw(`product_colors.title LIKE '%${search}%'`)
                .orWhereRaw(
                    `product_colors.color_id IN (SELECT colors.id FROM colors WHERE colors.title LIKE '%${search}%')`
                )
                .orWhere("product_colors.id", "LIKE", `%${search}%`)
        )
        .select(
            "product_colors.id",
            "product_colors.thumbnail",
            "product_colors.created_at",
            "product_colors.is_new",
            "product_colors.title",
            "product_colors.status"
        )
    // Сортировка
    const order = sorter.order === "ascend" ? "asc" : "desc"
    // Сортировка по кол-ву размеров в цвете JSON
    if (sorter.field) productColorsRef.orderBy(sorter.field, order)
    // Условия
    if (type !== "all")
        productColorsRef.where("product_colors.status", type)
    // Пагинация
    const productColors = await productColorsRef.page(
        pagination.current - 1,
        pagination.pageSize
    )

    return res.send(productColors)
}

/**
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetBySearch = async (req, res) => {
    const {search} = req.body
    const products = await ProductColor.query()
        .select("id", "thumbnail", "product_id", "title")
        .withGraphFetched(`[details, discount, color, sizes]`)
        .modify("search", search)
    return res.send(products)
}

/**
 * Удалить цвет продукта
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @constructor
 */
const Delete = async (req, res) => {
    const {productColorId} = req.params
    //  Проверка наличия цвета
    const productColor = await ProductColor.query<any>().findById(productColorId)
    if (productColor) {
        // Проверяем остальные цвета
        const productColors = await ProductColor.query<any>().where({
            product_id: productColor.product_id
        })
        if (!(productColors && productColors.length > 1))
            // Удаляем товар
            await Product.query<any>()
                .where({id: productColor.product_id})
                .delete()

        // Удаляем цвет товара
        await ProductColor.query<any>().deleteById(productColorId)
        // Удаляем папку с картинками
        await ImageService.DeleteFolder(
            `${IMAGES_FOLDER_PATH}${productColor.id}`
        )
    }
    // Если товар не найден
    else return res.status(500).send({message: "Товар не найден!"})
    return res.send({status: "success"})
}

/**
 * Вывод картинок по id продукта
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetImagesById = async (req, res) => {
    const {id} = req.params
    const images = await ProductColorImage.query()
        .where("product_color_id", id)
        .orderBy("position", "asc")
        .select("id", "path")
    return res.send(images)
}

export default {
    GetAllPaginate,
    GetBySearch,
    Delete,
    GetImagesById
}
