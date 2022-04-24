import {PrintImage} from "models/print/PrintImage"
import {PrintProduct} from "models/print/PrintProduct"
import ImageService from "services/image/ImageService"

//
const PATH_TO_FOLDER_IMAGES = "../../../public/images/print-images"
const PATH_TO_IMAGE = "images/print-images"

const GetAll = async (req, res) => {
    const printImages = await PrintImage.query()
        .where({hide_id: null})
        .withGraphFetched("[category]")
        .select("id", "title", "hide_id", "image", "price", "thumbnail")
    return res.send(printImages)
}

/**
 * Добавить картинку для принта
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    const {title, price, category_id, url_image} = req.body
    const printImageRef = await PrintImage.query<any>().insertAndFetch({
        title,
        price,
        category_id
    })
    if (url_image) {
        // Загрузка картинки
        const [imagePath] = await ImageService.UploadImage({
            folderPath: `${PATH_TO_FOLDER_IMAGES}/${printImageRef.id}`,
            imagePatch: `${PATH_TO_IMAGE}/${printImageRef.id}`,
            fileImage: url_image
        })

        //
        const [thumbnailPath] = await ImageService.UploadImage({
            folderPath: `${PATH_TO_FOLDER_IMAGES}/${printImageRef.id}`,
            imagePatch: `${PATH_TO_IMAGE}/${printImageRef.id}`,
            fileImage: url_image,
            nameFile: "thumbnail",
            width: 350
        })

        // Обновление картинки
        await PrintImage.query<any>().findById(printImageRef.id).update({
            image: imagePath,
            thumbnail: thumbnailPath
        })
    }

    // Вывод картинки для принтов
    const printImage = await PrintImage.query()
        .findById(printImageRef.id)
        .withGraphFetched("[category]")
        .select("id", "title", "image", "price", "thumbnail")

    return res.send(printImage)
}

/**
 * Редактировать категорию
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Edit = async (req, res) => {
    const {id} = req.params
    const {title, url_image, category_id, price} = req.body
    const data: any = {title, category_id, price}

    if (url_image && !url_image.includes("http")) {
        const currentPrintImage = await PrintImage.query<any>().findById(id)
        await ImageService.DeleteImage(currentPrintImage.image)
        await ImageService.DeleteImage(currentPrintImage.thumbnail)

        // Загрузка картинки
        const [imagePath] = await ImageService.UploadImage({
            folderPath: `${PATH_TO_FOLDER_IMAGES}/${id}`,
            imagePatch: `${PATH_TO_IMAGE}/${id}`,
            fileImage: url_image
        })
        data.image = imagePath

        //
        const [thumbnailPath] = await ImageService.UploadImage({
            folderPath: `${PATH_TO_FOLDER_IMAGES}/${id}`,
            imagePatch: `${PATH_TO_IMAGE}/${id}`,
            fileImage: url_image,
            nameFile: "thumbnail",
            width: 350
        })
        data.thumbnail = thumbnailPath
    }
    await PrintImage.query().updateAndFetchById(id, data)

    const printImage = await PrintImage.query()
        .findById(id)
        .withGraphFetched("[category]")
        .select("id", "title", "price", "image", "thumbnail")

    return res.send(printImage)
}

const Delete = async (req, res) => {
    const {id} = req.params

    const printImage = await PrintImage.query().findById(id)
    if (!printImage) return res.status(500).send({message: "Ошибка! Картинка не найдена!"})

    const printProducts = await PrintProduct.query().where({print_image_id: id})
    if (printProducts.length)
        return res.status(500).send({message: "Ошибка! Удалите товары связанные с картинкой!"})

    await ImageService.DeleteFolder(`${PATH_TO_FOLDER_IMAGES}/${id}`)
    await PrintImage.query().deleteById(id)

    return res.send(id)
}

export default {Create, Edit, Delete, GetAll}
