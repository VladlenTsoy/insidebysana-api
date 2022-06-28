import {ProductColor} from "models/product/ProductColor"
import {Size} from "models/settings/Size"
import {Category} from "models/settings/Category"
import {Color} from "models/settings/Color"
import {body, validationResult} from "express-validator"
import {ProductHomePosition} from "models/product/ProductHomePosition"
import {map} from "lodash/fp"

const _getFilters = async ({
                               colorIds,
                               categoryId,
                               sizeIds,
                               subCategoryIds,
                               price
                           }) => {
    const response: any = {
        colors: [],
        sizes: [],
        categories: [],
        price: {min: 0, max: 0}
    }

    // Вывод размеров
    const productSize = await ProductColor.query<any>()
        .modify("filterCategory", categoryId)
        .modify("filterSubCategoryIn", subCategoryIds)
        .modify("filterColors", colorIds)
        .modify("filterPrice", price)
        .withGraphFetched("[sizes]")
    //
    const productSizeIds = productSize.reduce(
        (state, val) => [...state, ...val.sizes.map(size => size.size_id)],
        []
    )
    //
    response.sizes = await Size.query()
        .whereIn("id", productSizeIds)
        .select("id", "title")

    // Вывод под категорий
    const productCategoryIds = await ProductColor.query<any>()
        .modify("filterCategory", categoryId)
        .modify("filterSizes", sizeIds)
        .modify("filterColors", colorIds)
        .modify("filterPrice", price)
        .join("products", "products.id", "product_colors.product_id")
        .select("products.category_id")
        .then(map("category_id"))
    response.categories = await Category.query()
        .whereIn("id", productCategoryIds)
        .select("id", "title")

    // Вывод цветов
    const productColorIds = await ProductColor.query()
        .modify("filterCategory", categoryId)
        .modify("filterSubCategoryIn", subCategoryIds)
        .modify("filterSizes", sizeIds)
        .modify("filterPrice", price)
        .where("product_colors.status", "published")
        .select("color_id")
        .then(map("color_id"))
    //
    response.colors = await Color.query()
        .whereIn("id", productColorIds)
        .select("id", "title", "hex")

    // Вывод прайса
    response.price = await ProductColor.query()
        .join("products", "products.id", "product_colors.product_id")
        .modify("filterCategory", categoryId)
        .modify("filterSubCategoryIn", subCategoryIds)
        .modify("filterSizes", sizeIds)
        .findOne("status", "published")
        .min("products.price as min")
        .max("products.price as max")

    return response
}

/**
 * Вывод продуктов пагинация
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetPagination = async (req, res) => {
    const {
        categoryId,
        sizeIds,
        colorIds,
        subCategoryIds,
        price,
        sort
    } = req.body
    const products = await ProductColor.query()
        .withGraphFetched(`[discount, color, sizes]`)
        .join("products", "products.id", "product_colors.product_id")
        .orderBy(`products.${sort.column}`, sort.dir)
        .modify("filterCategory", categoryId)
        .modify("filterSubCategoryIn", subCategoryIds)
        .modify("filterSizes", sizeIds)
        .modify("filterColors", colorIds)
        .modify("filterPrice", price)
        .where("product_colors.status", "published")
        .where("product_colors.thumbnail", "IS NOT", null)
        .whereRaw(
            `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
        )
        .select(
            "product_colors.id",
            "product_colors.thumbnail",
            "product_colors.title",
            "products.category_id",
            "products.price",
            "product_colors.is_new"
        )

    // Вывод фильтров
    const filters = await _getFilters(req.body)

    return res.send({
        ...filters,
        products
    })
}

/**
 * Вывод цвета продукта по Id
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetById = async (req, res) => {
    const {id} = req.params

    const product = await ProductColor.query<any>()
        .findById(id)
        .withGraphFetched(`[sizes, color, discount, images]`)
        .join("products", "products.id", "product_colors.product_id")
        .select(
            "product_colors.id",
            "product_colors.product_id",
            "products.properties",
            "product_colors.title",
            "products.price"
        )

    product.colors = await ProductColor.query<any>()
        .join("colors", "colors.id", "product_colors.color_id")
        .where("product_colors.product_id", product.product_id)
        .where("product_colors.status", "published")
        .where("product_colors.thumbnail", "IS NOT", null)
        .whereRaw(
            `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
        )
        .select(
            "colors.id",
            "colors.title",
            "colors.hex",
            "product_colors.id as product_id"
        )

    return res.send(product)
}

/**
 * Вывод продуктов по Product ID (ТЕГИ)
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetByProductId = async (req, res) => {
    const {productId} = req.params
    const currentProduct = await ProductColor.query<any>().findById(productId)

    if (!(currentProduct.tags_id && currentProduct.tags_id.length))
        return res.send([])

    const products = await ProductColor.query()
        .withGraphFetched(`[discount, color]`)
        .join("products", "products.id", "product_colors.product_id")
        .where("product_colors.status", "published")
        .where("product_colors.thumbnail", "IS NOT", null)
        .whereNot("product_colors.id", productId)
        .modify("filterTags", currentProduct.tags_id)
        .orderBy("product_colors.created_at", "desc")
        .select(
            "product_colors.id",
            "product_colors.thumbnail",
            "product_colors.title",
            "products.category_id",
            "products.price",
            "product_colors.is_new"
        )

    return res.send(products)
}

/**
 * Вывод новинок
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetNew = async (req, res) => {
    const homeProducts = await ProductHomePosition.query<any>().orderBy(
        "position",
        "desc"
    )
    const ids = homeProducts.map(product => product.product_color_id)

    const products = await ProductColor.query()
        .withGraphFetched(`[discount, color]`)
        .join("products", "products.id", "product_colors.product_id")
        .where("product_colors.status", "published")
        .where("product_colors.thumbnail", "IS NOT", null)
        .whereRaw(
            `product_colors.id IN (SELECT product_home_positions.product_color_id FROM product_home_positions)`
        )
        .whereRaw(
            `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
        )
        .orderByRaw(`FIELD(product_colors.id, ${ids.reverse().join(",")})`)
        .select(
            "product_colors.id",
            "product_colors.thumbnail",
            "product_colors.title",
            "products.category_id",
            "products.price",
            "product_colors.is_new"
        )
        .limit(24)

    return res.send(products)
}

const SearchValidate = [
    body("search")
        .not()
        .isEmpty()
        .withMessage("Введите название или SKU товара!")
]

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Search = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()})

    let {search} = req.body

    if (search.includes("PC")) {
        const [productColorId] = search.match(/\d+/g)
        search = productColorId
    }

    const products = await ProductColor.query()
        .join("products", "products.id", "product_colors.product_id")
        .withGraphFetched(`[discount, color]`)
        .whereRaw(
            `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
        )
        .where("product_colors.status", "published")
        .where("product_colors.thumbnail", "IS NOT", null)
        .where(builder => {
            if (search.trim() !== "")
                builder
                    .where("product_colors.title", "LIKE", `%${search}%`)
                    .orWhere("product_colors.id", "LIKE", `%${search}%`)
        })
        .select(
            "product_colors.id",
            "product_colors.thumbnail",
            "product_colors.title",
            "products.category_id",
            "products.price",
            "product_colors.is_new"
        )

    return res.send(products)
}

/**
 * Недавно просмотренные продукты
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetByRecentIds = async (req, res) => {
    const {ids, productColorId} = req.body
    const products = await ProductColor.query()
        .skipUndefined()
        .withGraphFetched(
            `[
                discount(),
                color(),                
            ]`
        )
        .whereIn("product_colors.id", ids)
        .whereNot("product_colors.id", productColorId)
        .join("products", "products.id", "product_colors.product_id")
        .where("product_colors.status", "published")
        .where("product_colors.thumbnail", "IS NOT", null)
        .whereRaw(
            `product_colors.id IN (SELECT product_sizes.product_color_id FROM product_sizes WHERE product_sizes.qty > 0)`
        )
        .orderByRaw(`FIELD(product_colors.id, ${ids.reverse().join(",")})`)
        .select(
            "product_colors.id",
            "product_colors.thumbnail",
            "product_colors.title",
            "products.category_id",
            "products.price",
            "product_colors.is_new"
        )

    return res.send(products)
}

const GetIds = async (req, res) => {
    // @ts-config
    const products = await ProductColor.query<any>()
        .then(map("id"))
    return res.send(products)
}

export default {
    GetPagination,
    GetById,
    GetByProductId,
    GetNew,
    SearchValidate,
    Search,
    GetByRecentIds,
    GetIds
}
