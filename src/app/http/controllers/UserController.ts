import StaffOauthAccessTokenService from "services/auth/StaffOauthAccessTokenService"

/**
 * Вывод текущего пользователя
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetCurrent = async (req, res) => {
    const user = req.user
    return res.send(user)
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
    await StaffOauthAccessTokenService.delete(user.token)
    req.logout()
    res.send({status: "success"})
}

export default {
    GetCurrent,
    Logout
}
