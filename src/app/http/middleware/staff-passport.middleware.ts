import passport from "passport"
import BearerStrategy from "passport-http-bearer"
import jwt from "jsonwebtoken"
import {StaffOauthAccessToken} from "models/auth/StaffOauthAccessToken"
import {User} from "models/User"

passport.use(
    "crm-access",
    new BearerStrategy(async function(token, done) {
        if (token && jwt.decode(token)) {
            // Декодирование хэша в токен
            const jwtDecode = jwt.decode(token)
            if (jwtDecode && typeof jwtDecode !== "string" && jwtDecode.jti) {
                // Поиск токена
                const oauthAccess = await StaffOauthAccessToken.query().findById(jwtDecode.jti)
                if (oauthAccess) {
                    // Поиск пользователя
                    const user = await User.query()
                        .findById(oauthAccess.user_id)
                        .select("id", "full_name", "photo", "email", "access", "created_at")
                    // Пользователь найден
                    if (user) return done(null, {...user, token: jwtDecode.jti}, {scope: "all"})
                }
            }
        }
        return done(null, false)
    })
)

export default passport.authenticate("crm-access", {session: false})
