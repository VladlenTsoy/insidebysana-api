import {Lookbook} from "models/settings/Lookbook"
import ImageService from "services/image/ImageService"
import {body, validationResult} from "express-validator"

const PATH_TO_FOLDER_IMAGES = "../../../public/images/lookbook"
const PATH_TO_IMAGE = "images/lookbook"

/**
 * Вывод всех lookbook
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const GetByCategoryId = async (req, res) => {
    const {categoryId} = req.params
    const lookbook = await Lookbook.query().where({category_id: categoryId})
    return res.send(lookbook)
}

const CreateValidate = [
    body("url_image").not().isEmpty().withMessage("Выберите картинку!"),
    body("position").not().isEmpty().withMessage("Выберите позицию!"),
    body("category_id").not().isEmpty().withMessage("Выберите категорию!")
]

/**
 * Создание баннера
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()})

    const {position, url_image, category_id} = req.body
    const LookbookRef = await Lookbook.query<any>().insertAndFetch({position, category_id})
    const [imagePath] = await ImageService.UploadImage({
        folderPath: `${PATH_TO_FOLDER_IMAGES}/${LookbookRef.id}`,
        imagePatch: `${PATH_TO_IMAGE}/${LookbookRef.id}`,
        fileImage: url_image
    })
    const lookbook = await Lookbook.query<any>()
        .select("id", "position", "image", "category_id")
        .updateAndFetchById(LookbookRef.id, {image: imagePath})
    return res.send(lookbook)
}

/**
 * Редактирование
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const EditById = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()})

    const {id} = req.params
    const {position, url_image, category_id} = req.body
    const data: any = {position, category_id}
    if (!url_image.includes("http")) {
        const [imagePath] = await ImageService.UploadImage({
            folderPath: `${PATH_TO_FOLDER_IMAGES}/${id}`,
            imagePatch: `${PATH_TO_IMAGE}/${id}`,
            fileImage: url_image
        })
        data.image = imagePath
        await ImageService.DeleteImagesExceptCurrent(`${PATH_TO_FOLDER_IMAGES}/${id}`, imagePath)
    }
    const lookbook = await Lookbook.query().updateAndFetchById(id, data)
    return res.send(lookbook)
}

/**
 * Удаление
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const DeleteById = async (req, res) => {
    const {id} = req.params
    await ImageService.DeleteFolder(`${PATH_TO_FOLDER_IMAGES}/${id}`)
    await Lookbook.query().deleteById(id)
    return res.send({status: "success"})
}

export default {GetByCategoryId, Create, CreateValidate, EditById, DeleteById}
