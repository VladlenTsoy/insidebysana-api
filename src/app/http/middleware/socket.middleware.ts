// import jwt from "jsonwebtoken"
// import {StaffOauthAccessToken} from "models/auth/StaffOauthAccessToken"
// import {User} from "app/models/User"
import {Socket} from "socket.io"
import {NextFunction} from "express"

const socketPassport = async (socket: Socket, next: NextFunction) => {
    // const token = socket.handshake.auth.token
    // if (token && jwt.decode(token)) {
    //     const {jti} = jwt.decode(token)
    //
    //     const oauthAccess = await CrmOauthAccessToken.query().findById(jti)
    //     if (!oauthAccess) return next(new Error("!"))
    //
    //     const user = await User.query().findById(oauthAccess.user_id)
    //     if (!user) return next(new Error("!"))
    //
    //     socket.user = user
    //     return next()
    // }
    return next(new Error("!"))
}

module.exports = socketPassport
