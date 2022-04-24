import SiteOauthAccessTokenService from "services/auth/SiteOauthAccessTokenService"
import {Client, ClientPassword} from "models/Client"

const GetCurrent = async (req, res) => {
    const user = req.user
    return res.send(user)
}

const Update = async (req, res) => {
    const {full_name, email, phone} = req.body
    const user = req.user

    const client = await Client.query<any>().updateAndFetchById(user.id, {full_name, email, phone})

    return res.send(client)
}

const ChangePassword = async (req, res) => {
    const {password, currentPassword} = req.body
    const user = req.user

    const client = await ClientPassword.query().findById(user.id)

    if (!client) return res.status(500).send({status: "error", message: "Ошибка! Повторите попытку!"})

    const isMatch = await client.verifyPassword(currentPassword)

    if (!isMatch)
        return res.status(500).send({status: "error", message: "Ошибка! Текущий пароль введен неверно."})

    await ClientPassword.query().findById(user.id).update({password})

    return res.send({status: "success"})
}

/**
 * Выход
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Logout = async (req, res) => {
    const user = req.user
    await SiteOauthAccessTokenService.delete(user.token)
    req.logout()
    res.send({status: "success"})
}

export default {GetCurrent, Logout, Update, ChangePassword}
