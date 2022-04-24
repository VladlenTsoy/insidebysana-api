import {Source} from "models/settings/Source"
import {body, validationResult} from "express-validator"

/**
 * Вывод всех
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const sources = await Source.query()
        .select("id", "title")
    return res.send(sources)
}

const CreateValidate = [
    body("title").not().isEmpty().withMessage("Введите название ресурса!")
]

/**
 * Создать ресурс
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()})

    const {title} = req.body
    const source = await Source.query<any>()
        .insertAndFetch({title})
    return res.send(source)
}

/**
 * Редактирование ресурса
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const EditById = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()})

    const {id} = req.params
    const {title} = req.body
    const source = await Source.query<any>()
        .updateAndFetchById(id, {title})
    return res.send(source)
}

export default {GetAll, Create, CreateValidate, EditById}
