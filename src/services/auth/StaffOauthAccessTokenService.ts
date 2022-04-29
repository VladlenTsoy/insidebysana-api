import {StaffOauthAccessToken} from "models/auth/StaffOauthAccessToken"
import jwt from "jsonwebtoken"
import moment from "moment"
import md5 from "md5"

export default {
    /**
     * Создание токена
     * @param userId
     * @param remember
     */
    create: async (userId, remember) => {
        const hash = md5(userId + moment().toISOString())

        // Создание токена
        await StaffOauthAccessToken.query().insertAndFetch({
            id: hash,
            user_id: userId,
            expires_at: remember
                ? moment().add(30, "days").format("YYYY-MM-DD HH:mm:ss")
                : moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss")
        })

        return jwt.sign({jti: hash}, "fSuQSv8srByT0f09626oiY6cvzuf7vxXQG3dy5Yu")
    },
    /**
     * Удаление токена
     * @param token
     */
    delete: async token => {
        await StaffOauthAccessToken.query().findById(token).delete()
    }
}
