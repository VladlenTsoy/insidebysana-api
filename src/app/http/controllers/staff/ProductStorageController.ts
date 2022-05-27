import {ProductStorage} from "models/product/ProductStorage"
import {body, validationResult} from "express-validator"

export default {
    CreateValidate: [
        body("title").not().isEmpty().withMessage("Введите название ресурса!")
    ],
    /**
     * Вывод всех мест хранений
     * @param req
     * @param res
     * @constructor
     */
    GetAll: async (req, res) => {
        const productStorages = await ProductStorage.query()
        return res.send(productStorages)
    },
    /**
     * Создать место хранения
     * @param req
     * @param res
     * @constructor
     */
    Create: async (req, res) => {
        // Ошибка валидации
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        const {title} = req.body
        const productStorage = await ProductStorage.query<any>()
            .insertAndFetch({title})
        return res.send(productStorage)
    },

    /**
     * Редактирование места хранения
     * @param req
     * @param res
     * @return {Promise<*>}
     * @constructor
     */
    EditById: async (req, res) => {
        // Ошибка валидации
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        const {id} = req.params
        const {title} = req.body
        const productStorage = await ProductStorage.query<any>()
            .updateAndFetchById(id, {title})
        return res.send(productStorage)
    }
}
