import {Product} from "models/product/Product"
import {ProductColor, ProductColorSelectEdit} from "models/product/ProductColor"
import ProductMeasurementService from "services/product/ProductMeasurementService"
import ProductTagService from "services/product/ProductTagService"
import ImageService from "services/image/ImageService"
import {ProductHomePosition} from "models/product/ProductHomePosition"
import {ProductSize} from "models/product/ProductSize"
import {ProductColorImage} from "models/product/ProductColorImage"
import {ProductDiscount} from "models/product/ProductDiscount"

const PATH_TO_FOLDER_TMP = "../../../public/images/tmp"
const PATH_TO_FOLDER_IMAGES = "../../../public/images/product-colors"
const PATH_TO_IMAGE = "images/product-colors"

const Create = async (req, res) => {
    const data = req.body
    let productId = data?.product_id
    // Создание продукта
    if (!data.product_id) {
        const productRef = await Product.query<any>().insertAndFetch({
            category_id: data.category_id,
            price: data.price,
            properties: data.properties || []
        })
        productId = productRef.id
    }
    // Найти или создать тег по названию
    const tagsId = await ProductTagService.FindOrCreate(data.tags_id)
    // Создание цвета
    const productColor = await ProductColor.query<any>().insertAndFetch({
        title: data.title,
        product_id: productId,
        color_id: data.color_id,
        thumbnail: null,
        status: data.status,
        tags_id: tagsId,
        storage_id: data.storage_id,
        is_new: data.is_new
    })
    // Скидки
    if (
        data.discount &&
        data.discount.discount &&
        data.discount.discount !== 0
    ) {
        const discount = await ProductDiscount.query<any>().findOne({
            product_color_id: productColor.id
        })
        if (discount)
            await ProductDiscount.query<any>()
                .findById(discount.id)
                .update({
                    discount: data.discount.discount,
                    end_at: data.discount.end_at || null
                })
        else
            await ProductDiscount.query<any>().insert({
                product_color_id: productColor.id,
                discount: data.discount.discount,
                end_at: data.discount.end_at || null
            })
    } else {
        await ProductDiscount.query()
            .findOne({
                product_color_id: productColor.id
            })
            .delete()
    }
    // Создание размеров
    await Promise.all(
        data.sizes.map(
            async size =>
                await ProductSize.query<any>().insert({
                    product_color_id: productColor.id,
                    size_id: size.size_id,
                    qty: size.qty,
                    min_qty: size.min_qty,
                    cost_price: size.cost_price
                })
        )
    )
    // Сохранение картинок
    if (data.images && data.images.length) {
        const updatedPathToImages = await Promise.all(
            data.images.map(async image => {
                await ImageService.MoveFile({
                    nameImage: image.name,
                    oldPath: `${PATH_TO_FOLDER_TMP}/${image.name}`,
                    newPath: `${PATH_TO_FOLDER_IMAGES}/${productColor.id}/${image.name}`,
                    folderPath: `${PATH_TO_FOLDER_IMAGES}/${productColor.id}`
                })
            })
        )
        if (updatedPathToImages) {
            await Promise.all(
                data.images.map(async (image, key) => {
                    if (key === 0) {
                        await ProductColor.query<any>()
                            .findOne({id: productColor.id})
                            .update({
                                thumbnail: `${PATH_TO_IMAGE}/${productColor.id}/${image.name}`
                            })
                    }
                    await ProductColorImage.query<any>().insert({
                        product_color_id: productColor.id,
                        name: image.name,
                        path: `${PATH_TO_IMAGE}/${productColor.id}/${image.name}`,
                        size: image.size,
                        position: key
                    })
                })
            )
        }
    }
    // Сохранение или обновление объемов
    if (data.measurements)
        await ProductMeasurementService.CreateOrUpdate(
            data.measurements,
            productColor.id
        )
    // Позиция на главной странице
    if (data.home_position)
        await ProductHomePosition.query<any>().insert({
            product_color_id: productColor.id,
            position: data.home_position
        })

    return res.send({status: "success"})
}

const GetById = async (req, res) => {
    const {id} = req.params
    const product = await ProductColorSelectEdit.query()
        .findById(id)
        .join("products", "products.id", "product_colors.product_id")
        .leftJoin(
            "product_home_positions",
            "product_home_positions.product_color_id",
            "product_colors.id"
        )
        .withGraphFetched(`[measurements, images, colors, sizes, discount]`)
        .select(
            "product_colors.id",
            "product_colors.title",
            "product_colors.color_id",
            "product_colors.tags_id",
            "product_colors.status",
            "product_colors.is_new",
            "product_colors.storage_id",
            "products.category_id",
            "products.properties",
            "product_colors.product_id",
            "products.price",
            "product_home_positions.position as home_position"
        )
    return res.send(product)
}

const EditById = async (req, res) => {
    const {id} = req.params
    const data = req.body
    // Найти или создать тег по названию
    const tagsId = await ProductTagService.FindOrCreate(data.tags_id)
    // Обновление цвета
    const productColor = await ProductColor.query<any>().patchAndFetchById(id, {
        title: data.title,
        color_id: data.color_id,
        thumbnail: null,
        status: data.status,
        tags_id: tagsId,
        is_new: data.is_new,
        storage_id: data.storage_id,
    })

    // Скидки
    if (
        data.discount &&
        data.discount.discount &&
        data.discount.discount !== 0
    ) {
        const discount = await ProductDiscount.query<any>().findOne({
            product_color_id: productColor.id
        })
        if (discount)
            await ProductDiscount.query<any>()
                .findById(discount.id)
                .update({
                    discount: data.discount.discount,
                    end_at: data.discount.end_at || null
                })
        else
            await ProductDiscount.query<any>().insert({
                product_color_id: productColor.id,
                discount: data.discount.discount,
                end_at: data.discount.end_at || null
            })
    } else {
        await ProductDiscount.query<any>()
            .findOne({
                product_color_id: productColor.id
            })
            .delete()
    }

    // Обновление размеров
    await Promise.all(
        data.sizes.map(async size =>
            size.id
                ? await ProductSize.query<any>().findById(size.id).update({
                    qty: size.qty,
                    min_qty: size.min_qty,
                    cost_price: size.cost_price
                })
                : await ProductSize.query<any>().insert({
                    product_color_id: productColor.id,
                    size_id: size.size_id,
                    qty: size.qty,
                    min_qty: size.min_qty,
                    cost_price: size.cost_price
                })
        )
    )
    // Обновление продукта
    await Product.query<any>().patchAndFetchById(productColor.product_id, {
        category_id: data.category_id,
        price: data.price,
        properties: data.properties || []
    })
    // Сохранение картинок
    if (data.images && data.images.length) {
        const updatedPathToImages = await Promise.all(
            data.images.map(async image => {
                if (!image.isSaved)
                    await ImageService.MoveFile({
                        nameImage: image.name,
                        oldPath: `${PATH_TO_FOLDER_TMP}/${image.name}`,
                        newPath: `${PATH_TO_FOLDER_IMAGES}/${productColor.id}/${image.name}`,
                        folderPath: `${PATH_TO_FOLDER_IMAGES}/${productColor.id}`
                    })
            })
        )
        if (updatedPathToImages) {
            await Promise.all(
                data.images.map(async (image, key) => {
                    if (key === 0) {
                        await ProductColor.query()
                            .findById(productColor.id)
                            .update({
                                thumbnail: `${PATH_TO_IMAGE}/${productColor.id}/${image.name}`
                            })
                    }
                    if (image.isSaved)
                        await ProductColorImage.query<any>()
                            .findById(image.id)
                            .update({position: key})
                    else
                        await ProductColorImage.query<any>().insert({
                            product_color_id: productColor.id,
                            name: image.name,
                            path: `${PATH_TO_IMAGE}/${productColor.id}/${image.name}`,
                            size: image.size,
                            position: key
                        })
                })
            )
        }
    }
    // Сохранение или обновление объемов
    if (data.measurements)
        await ProductMeasurementService.CreateOrUpdate(
            data.measurements,
            productColor.id
        )
    // Позиция на главной странице
    if (data.home_position) {
        const productHomePosition = await ProductHomePosition.query().findOne(
            {product_color_id: productColor.id}
        )
        if (productHomePosition)
            await ProductHomePosition.query<any>()
                .findOne({product_color_id: productColor.id})
                .update({
                    position: data.home_position
                })
        else
            await ProductHomePosition.query<any>().insert({
                product_color_id: productColor.id,
                position: data.home_position
            })
    } else
        await ProductHomePosition.query()
            .findOne({product_color_id: productColor.id})
            .delete()

    return res.send({status: "success"})
}

export default {Create, GetById, EditById}
