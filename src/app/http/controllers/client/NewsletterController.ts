import {body, validationResult} from "express-validator"
import {Newsletter} from "models/settings/Newsletter"
import md5 from "md5"

const SubscribeValidate = [
    body("email").isEmail().withMessage("Введен неверный E-mail!")
]

/**
 * Подписаться
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
const Subscribe = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()})

    const {email} = req.body
    const check = await Newsletter.query().findOne({email})

    if (check)
        return res.send({status: "success", message: "1"})

    const token = md5(email)
    await Newsletter.query<any>().insert({email, token})

    return res.send({status: "success", message: "2"})
}

export default {SubscribeValidate, Subscribe}
