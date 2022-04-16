import passport from "passport"
import BearerStrategy from "passport-http-bearer"
import jwt from "jsonwebtoken"
import {SiteOauthAccessToken} from "models/auth/SiteOauthAccessToken"
import {Client} from "models/Client"

passport.use(
    "site-access",
    new BearerStrategy(async function(token, done) {
        if (token && jwt.decode(token)) {
            // Декодирование хэша в токен
            const jwtDecode = jwt.decode(token)
            if (jwtDecode && typeof jwtDecode !== "string" && jwtDecode.jti) {
                // Поиск токена
                const oauthAccess = await SiteOauthAccessToken.query().findById(jwtDecode.jti)
                if (oauthAccess) {
                    // Поиск пользователя
                    const client = await Client.query().findById(
                        oauthAccess.client_id
                    )
                    // Пользователь найден
                    if (client) return done(null, {...client, token}, {scope: "all"})
                }
            }
        }
        return done(null, false)
    })
)

export default passport.authenticate("site-access", {session: false})
