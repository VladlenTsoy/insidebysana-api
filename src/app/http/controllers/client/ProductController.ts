import {Product} from "models/product/Product"
import {ProductColor} from "models/product/ProductColor"
import {Size} from "models/settings/Size"
import {Category} from "models/settings/Category"

const GetAll = async (req, res) => {
    const {filter, categoryId, sizeIds, subCategoryIds, sort} = req.body
    const response: any = {
        products: [],
        sizes: [],
        categories: []
    }
    let filterProducts

    const productsRef = Product.query().select("*")
    const filterProductsRef = Product.query().select("*")

    if (sort) {
        productsRef.orderBy(sort.column, sort.dir)
        filterProductsRef.orderBy(sort.column, sort.dir)
    }

    // Фильтрация по под категорий
    if (subCategoryIds && subCategoryIds.length) {
        if (filter !== "sub-categories")
            filterProductsRef.whereIn("category_id", subCategoryIds)
        productsRef.whereIn("category_id", subCategoryIds)
    }

    // Фильтрация по категории
    if (categoryId && categoryId.match(/^\d+/)) {
        await filterProductsRef.modify("filterCategory", categoryId)
        await productsRef.modify("filterCategory", categoryId)
    }

    // Фильтрация по размерам
    if (sizeIds) {
        const productColors = await ProductColor.query<any>()
            .modify("sizes", sizeIds)
        const productColorIds = productColors.map(product => product.product_id)
        if (filter !== "sizes")
            filterProductsRef.whereIn("id", productColorIds)
        productsRef.whereIn("id", productColorIds)
    }

    // Продукты
    response.products = await productsRef
    filterProducts = await filterProductsRef

    if ((filter === "sizes" && filterProducts) || (filter !== "sizes" && response.products)) {
        // Вывод размеров
        const productIds = (filter === "sizes" ? filterProducts : response.products).map(product => product.id)
        const productSizes = await ProductColor.query()
            .whereIn("product_id", productIds)

        if (productSizes) {
            const sizeIds = productSizes.reduce((state: any[], product: any) => {
                const keys: any[] = Object.keys(product.sizes)
                for (let id of keys)
                    if (!state.includes(id))
                        state.push(id)
                return state
            }, [])

            response.sizes = await Size.query().whereIn("id", sizeIds).select("id", "title")
        }

        // Вывод под категорий
        const productCategoryIds = (filter === "sub-categories" ? filterProducts : response.products).map(product => product.category_id)
        response.categories = await Category.query().whereIn("id", productCategoryIds).select("id", "title")
    }

    return res.send(response)
}

const GetById = async (req, res) => {
    const {id} = req.params
    const product = await Product.query<any>()
        .withGraphFetched(`[
                colors(),
                measurements(),
            ]`)
        .findById(id)

    const _measurements: any = {
        titles: [],
        values: []
    }
    if (product.measurements) {
        _measurements.titles = product.measurements.map((measurement) => measurement.title)
        const a = product.measurements.map((measurement) => measurement.descriptions)
        const b = a.reduce((state, value) => {
            Object.entries(value).map(val => {
                if (typeof state[val[0]] === "object")
                    state[val[0]].push(val[1])
                else if (typeof state[val[0]] === "undefined")
                    return state[val[0]] = [val[1]]
            })
            return state
        }, {})

        _measurements.sizes = await Promise.all(
            Object.entries(b).map(async ([key, val]) => {
                const size = await Size.query<any>().findById(key).select("id", "title")
                return {
                    name: size ? size.title : "Н/Д",
                    descriptions: val
                }
            })
        )
    }
    product.measurements = _measurements

    return res.send(product)
}

export default {GetAll, GetById}
