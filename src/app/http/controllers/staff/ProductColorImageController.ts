import {ProductColorImage} from "models/product/ProductColorImage"
import {ProductColor} from "models/product/ProductColor"
import ImageService from "services/image/ImageService"

const PATH_TO_FOLDER_IMAGES = "../../../public/images/products"
const PATH_TO_IMAGE = "images/products"

/**
 * Вывод картинок по Color Id
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetByProductColorId = async (req, res) => {
    const {productColorId} = req.params
    const prints = await ProductColorImage.query().where({product_color_id: productColorId})
    return res.send(prints)
}

/**
 * Загрузка картинок
 * @param req
 * @param res
 * @return {Promise<void>}
 * @constructor
 */
const Upload = async (req, res) => {
    const {productColorId} = req.params
    const file = req.file
    const checkImage = await ProductColorImage.query<any>().findOne({product_color_id: productColorId})
    const imageRef = await ProductColorImage.query<any>().insert({product_color_id: productColorId})
    // Загрузка картинки
    const [imagePath] = await ImageService.UploadImage({
        folderPath: `${PATH_TO_FOLDER_IMAGES}/${productColorId}`,
        imagePatch: `${PATH_TO_IMAGE}/${productColorId}`,
        fileImage: file,
        width: 700
    })
    //
    const image = await ProductColorImage.query<any>().updateAndFetchById(imageRef.id, {
        image: imagePath,
        thumbnail: checkImage ? "0" : "1"
    })
    //
    if (!checkImage) {
        const [thumbnailPath] = await ImageService.UploadImage({
            folderPath: `${PATH_TO_FOLDER_IMAGES}/${productColorId}`,
            imagePatch: `${PATH_TO_IMAGE}/${productColorId}`,
            fileImage: file,
            nameFile: "thumbnail",
            width: 350
        })

        if (thumbnailPath)
            await ProductColor.query<any>().findOne({id: productColorId}).update({thumbnail: thumbnailPath})
    }

    return res.send(image)
}

/**
 * Удаление картинки
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Delete = async (req, res) => {
    const {id} = req.params
    // Проверка на наличия изображения
    const productColorImage = await ProductColorImage.query<any>().findById(id)
    if (productColorImage) {
        // Удаление файла
        await ImageService.DeleteImage(productColorImage.image)

        // Если thumbnail
        if (productColorImage.thumbnail === "1") {
            const productColor = await ProductColor.query<any>().findById(productColorImage.product_color_id)
            await ImageService.DeleteImage(productColor.thumbnail)
            await ProductColor.query<any>()
                .findById(productColorImage.product_color_id)
                .update({thumbnail: null})
        }
        // Удаление изображения из базы
        await ProductColorImage.query().deleteById(id)
    }
    // Изображение не найдено в базе
    else return res.status(500).send({status: "Изображение не найдено!"})

    return res.send({status: "success"})
}

export default {GetByProductColorId, Upload, Delete}
