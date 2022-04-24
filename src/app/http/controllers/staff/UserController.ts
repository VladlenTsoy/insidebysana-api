import {UserPassword, User} from "models/User"
import {body, validationResult} from "express-validator"

const GetAllPaginate = async (req, res) => {
    const {search, pagination, sorter} = req.body
    const order = sorter.order === "ascend" ? "asc" : "desc"

    const users = await User.query()
        .modify("search", search)
        .orderBy(sorter.field, order)
        .page(pagination.page, pagination.pageSize)

    return res.send(users)
}

const CreateValidate = [
    body("full_name").notEmpty().withMessage("Введите имя!"),
    body("email").notEmpty().isEmail().withMessage("Введите почту!"),
    body("password").notEmpty().isLength({min: 6}).withMessage("Пароль меньше 6 букв!"),
    body("access").notEmpty().withMessage("Выберите доступ!")
]

/**
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()})

    const data = req.body
    const checkUser = await User.query().findOne({email: data.email})

    if (checkUser) return res.status(500).send({message: `Текущая почта (${data.email}) занята!`})

    const user = await UserPassword.query().insertAndFetch(data)
    return res.send(user)
}

/**
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Edit = async (req, res) => {
    const {id} = req.params
    const {full_name, email, password, access} = req.body
    const data: any = {full_name, email, access}
    //
    if (password && password.trim() !== "") data.password = password
    //
    const user = await (data.password ? UserPassword : User).query().updateAndFetchById(id, data)
    return res.send(user)
}

export default {GetAllPaginate, CreateValidate, Create, Edit}
