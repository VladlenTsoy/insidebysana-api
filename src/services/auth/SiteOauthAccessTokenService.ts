import {SiteOauthAccessToken} from "models/auth/SiteOauthAccessToken"
import jwt from "jsonwebtoken"
import moment from "moment"
import md5 from "md5"

export default {
    /**
     * Создание токена
     * @param clientId
     * @param remember
     */
    create: async (clientId, remember) => {
        const hash = md5(clientId + moment().toISOString())

        // Создание токена
        await SiteOauthAccessToken.query().insertAndFetch({
            id: hash,
            client_id: clientId,
            expires_at: remember
                ? moment().add(30, "days").format("YYYY-MM-DD HH:mm:ss")
                : moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss")
        })

        return jwt.sign({jti: hash}, "fSuQSv8srByT0f09626oiY6cvdasdvxXQG3dy5Yu")
    },

    /**
     * Удаление токена
     * @param token
     */
    delete: async (token) => {
        await SiteOauthAccessToken.query().findById(token).delete()
    }
}
