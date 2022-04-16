import {body, validationResult} from "express-validator"
import {Request, Response} from "express"
import {UserPassword} from "models/User"
import StaffOauthAccessTokenService from "services/auth/StaffOauthAccessTokenService"

export default {
    validate: [
        body("email").isEmail().withMessage("Введен неверный E-mail!"),
        body("password").isLength({min: 6}).withMessage("Пароль должен содержать более 5 символов!")
    ],

    /**
     * Авторизация по почте и паролю
     * @param req
     * @param res
     */
    emailAndPassword: async (req: Request, res: Response) => {
        // Ошибка валидации
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        const {email, password, remember} = req.body

        // Поиск пользователя по почте
        const user = await UserPassword.query().findOne({email})
        if (!user)
            return res.status(500).send({message: "Ошибка! Почта не найдена!"})

        // Проверка паролей
        const isMatch = await user.verifyPassword(password)
        if (!isMatch)
            return res.status(500).send({message: "Ошибка! Введен неправильный пароль!"})

        // Создание токена
        const token = await StaffOauthAccessTokenService.create(user.id, remember)

        return res.send({token})
    }
}
