import {Request, Response} from "express"
import {AdditionalService} from "models/settings/AdditionalService"
import ImageService from "services/image/ImageService"

const PATH_TO_FOLDER_IMAGES = "../../../public/images/additional-services"
const PATH_TO_IMAGE = "images/additional-services"

export default {
    getAll: async (req, res) => {
        const additionalServices = await AdditionalService.query()
        return res.send(additionalServices)
    },
    create: async (req, res) => {
        const {title, price, display, url_image} = req.body
        // Создать доп. услугу
        let additionalService = await AdditionalService.query<any>().insertAndFetch({
            title,
            price,
            display: display ? display : []
        })
        // Проверка картинки
        if (url_image) {
            // Загрузка картинки
            const [imagePath] = await ImageService.UploadImage({
                folderPath: `${PATH_TO_FOLDER_IMAGES}/${additionalService.id}`,
                imagePatch: `${PATH_TO_IMAGE}/${additionalService.id}`,
                fileImage: url_image,
                width: 500
            })
            // Обновить вывод
            additionalService = await AdditionalService.query<any>().updateAndFetchById(additionalService.id, {
                image: imagePath
            })
        }

        return res.send(additionalService)
    },
    edit: async (req: Request, res: Response) => {
        const {id} = req.params
        const data = req.body
        const {display, url_image} = data
        //
        if (url_image && !url_image.includes("http")) {
            const [imagePath] = await ImageService.UploadImage({
                folderPath: `${PATH_TO_FOLDER_IMAGES}/${id}`,
                imagePatch: `${PATH_TO_IMAGE}/${id}`,
                fileImage: url_image,
                width: 500
            })
            data.image = imagePath
            await ImageService.DeleteImagesExceptCurrent(`${PATH_TO_FOLDER_IMAGES}/${id}`, imagePath)
        }
        //
        const additionalService = await AdditionalService.query().updateAndFetchById(id, {
            ...data,
            display: display ? display : []
        })
        return res.send(additionalService)
    },
    delete: async (req, res) => {
        const {id} = req.params
        await ImageService.DeleteFolder(`${PATH_TO_FOLDER_IMAGES}/${id}`)
        await AdditionalService.query().deleteById(id)
        return res.send({status: "success"})
    }
}
