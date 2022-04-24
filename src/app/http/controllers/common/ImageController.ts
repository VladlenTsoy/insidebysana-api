import ImageService from "services/image/ImageService"
import {ProductColorImage} from "models/product/ProductColorImage"

const PATH_TO_FOLDER_IMAGES = "../../../public/images/tmp"
const PATH_TO_IMAGE = "images/tmp"

/**
 * Загрузка временных картинок
 * @param {*} req
 * @param {*} res
 * @returns
 */
const Upload = async (req, res) => {
    const {image, time} = req.body
    const [imagePath, imageName, size] = await ImageService.UploadImage({
        folderPath: `${PATH_TO_FOLDER_IMAGES}`,
        imagePatch: `${PATH_TO_IMAGE}`,
        fileImage: image,
        nameFile: time
    })
    return res.send({
        loading: false,
        imageUrl: `${process.env.APP_URL}/${imagePath}`,
        imagePath,
        imageName,
        id: time,
        time,
        imageSize: size
    })
}

/**
 * Удаление временной картинки
 * @param {*} req
 * @param {*} res
 * @returns
 */
const Delete = async (req, res) => {
    const {pathToImage, id} = req.body
    if (id) await ProductColorImage.query().deleteById(id)
    await ImageService.DeleteImage(pathToImage)
    return res.send({status: "success"})
}

export default {Upload, Delete}
