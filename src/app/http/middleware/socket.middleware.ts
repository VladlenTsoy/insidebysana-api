import jwt from "jsonwebtoken"
import {StaffOauthAccessToken} from "models/auth/StaffOauthAccessToken"
import {User} from "app/models/User"
import {Socket} from "socket.io"
import {NextFunction} from "express"

export const socketPassport = async (socket: Socket, next: NextFunction) => {
    const token = socket.handshake.auth.token
    if (token && jwt.decode(token)) {
        const jwtDecode = jwt.decode(token)
        if (jwtDecode && typeof jwtDecode !== "string" && jwtDecode.jti) {

            const oauthAccess = await StaffOauthAccessToken.query().findById(jwtDecode.jti)
            if (!oauthAccess) return next(new Error("!"))

            const user = await User.query().findById(oauthAccess.user_id)
            if (!user) return next(new Error("!"))

            // @ts-ignore
            socket.user = user
            return next()
        }
    }
    return next(new Error("!"))
}
