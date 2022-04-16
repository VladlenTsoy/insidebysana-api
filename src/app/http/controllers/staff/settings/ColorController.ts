import {Color} from "models/settings/Color"
import {ProductColor} from "models/product/ProductColor"
import {body, validationResult} from "express-validator"

export default {
    createValidate: [
        body("title").not().isEmpty().withMessage("Введите название цвета!"),
        body("hex").not().isEmpty().withMessage("Выберите цвет!")
    ],
    create: async (req, res) => {
        // Ошибка валидации
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()})

        const {title, hex} = req.body
        const color = await Color.query<any>().insertAndFetch({title, hex})
        return res.send(color)
    },
    edit: async (req, res) => {
        // Ошибка валидации
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()})

        const {id} = req.params
        const {title, hex} = req.body
        const color = await Color.query<any>().updateAndFetchById(id, {title, hex})
        return res.send(color)
    },
    delete: async (req, res) => {
        const {id} = req.params
        const productColors = await ProductColor.query().where("color_id", id)

        if (productColors.length)
            return res
                .status(500)
                .send({status: "warning", message: "Невозможно удалить! Данный цвет используют!"})
        else await Color.query().deleteById(id)

        return res.send({status: "success"})
    },
    getAll: async (req, res) => {
        const colors = await Color.query<any>().select("id", "title", "hex", "hide_id")
        return res.send(colors)
    },
    hide: async (req, res) => {
        const {id} = req.params
        const user = req.user
        const color = await Color.query<any>().updateAndFetchById(id, {hide_id: user.id})
        return res.send(color)
    },
    display: async (req, res) => {
        const {id} = req.params
        const color = await Color.query<any>().updateAndFetchById(id, {hide_id: null})
        return res.send(color)
    }
}
