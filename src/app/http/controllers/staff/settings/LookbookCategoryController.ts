import {LookbookCategory} from "models/settings/LookbookCategory"
import {Lookbook} from "models/settings/Lookbook"
import ImageService from "services/image/ImageService"

const PATH_TO_FOLDER_IMAGES = "../../../public/images/lookbook-categories"
const PATH_TO_IMAGE = "images/lookbook-categories"

const GetAll = async (req, res) => {
    const categories = await LookbookCategory.query().select("id", "title", "image")
    return res.send(categories)
}

const Create = async (req, res) => {
    const {title, url_image} = req.body
    const lookbookCategoryRef = await LookbookCategory.query<any>().insertAndFetch({title})
    //
    const [imagePath] = await ImageService.UploadImage({
        folderPath: `${PATH_TO_FOLDER_IMAGES}/${lookbookCategoryRef.id}`,
        imagePatch: `${PATH_TO_IMAGE}/${lookbookCategoryRef.id}`,
        fileImage: url_image
    })
    //
    const lookbookCategory = await LookbookCategory.query<any>()
        .select("id", "title", "image")
        .updateAndFetchById(lookbookCategoryRef.id, {image: imagePath})
    //
    return res.send(lookbookCategory)
}

/**
 * Редактирование
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const EditById = async (req, res) => {
    const {id} = req.params
    const {title, url_image} = req.body
    const data: any = {title}
    if (!url_image.includes("http")) {
        const [imagePath] = await ImageService.UploadImage({
            folderPath: `${PATH_TO_FOLDER_IMAGES}/${id}`,
            imagePatch: `${PATH_TO_IMAGE}/${id}`,
            fileImage: url_image
        })
        data.image = imagePath
        await ImageService.DeleteImagesExceptCurrent(`${PATH_TO_FOLDER_IMAGES}/${id}`, imagePath)
    }
    const lookbookCategory = await LookbookCategory.query().updateAndFetchById(id, data)
    return res.send(lookbookCategory)
}

/**
 * Удаление
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Delete = async (req, res) => {
    const {id} = req.params
    //
    const lookbook = await Lookbook.query().where({category_id: id})
    if (lookbook.length) return res.status(500).send({message: "Ошибка! Категория не пустая!"})
    //
    await ImageService.DeleteFolder(`${PATH_TO_FOLDER_IMAGES}/${id}`)
    //
    await LookbookCategory.query().deleteById(id)
    return res.send({status: "success"})
}

export default {GetAll, Create, Delete, EditById}
