import {body, validationResult} from "express-validator"
import {Request, Response} from "express"

export default {
    validate: [
        body("email").isEmail().withMessage("Введен неверный E-mail!"),
        body("password").isLength({min: 6}).withMessage("Пароль должен содержать более 5 символов!")
    ],
    emailAndPassword: (req: Request, res: Response) => {
        // Ошибка валидации
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        try {

        } catch (e) {

        }
    }
}
