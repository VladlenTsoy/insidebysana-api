import {ClientPassword} from "models/Client"
import {body, validationResult} from "express-validator"
import SiteOauthAccessTokenService from "services/auth/SiteOauthAccessTokenService"

const LoginValidate = [
    body("email").isEmail().withMessage("Введен неверный E-mail!"),
    body("password").isLength({min: 6}).withMessage("Пароль должен содержать более 5 символов!")
]

const Login = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()})

    const {email, password} = req.body

    // Поиск пользователя по почте
    const user = await ClientPassword.query().findOne({email})
    if (!user)
        return res.status(500).send({message: "Ошибка! Почта не найдена!"})

    // TODO - исправить если есть клиент без регистрации
    if (!user.password)
        return res.status(500).send({message: "Ошибка! Введен неправильный пароль!!"})

    // Проверка паролей
    const isMatch = await user.verifyPassword(password)
    if (!isMatch)
        return res.status(500).send({message: "Ошибка! Введен неправильный пароль!"})

    // Создание токена
    const token = await SiteOauthAccessTokenService.create(user.id)

    res.send({token})
}


const RegistrationValidate = [
    body("full_name").not().isEmpty().withMessage("Введите имя!"),
    body("email").isEmail().withMessage("Введите E-mail!"),
    body("password").isLength({min: 6}).withMessage("Пароль должен содержать более 5 символов!")
]

const Registration = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()})

    const {email, password, full_name} = req.body

    // TODO - email if create client
    // Поиск пользователя по почте
    const checkClient = await ClientPassword.query().findOne({email})
    if (checkClient)
        return res.status(500).send({message: "Ошибка! Почта уже существует!"})

    const client: any = await ClientPassword.query().insertAndFetch({
        email, password, full_name, source_id: 3
    })

    // Создание токена
    const token = await SiteOauthAccessTokenService.create(client.id)
    res.send({token})
}

export default {LoginValidate, Login, RegistrationValidate, Registration}
