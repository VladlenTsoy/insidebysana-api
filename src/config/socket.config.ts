import {Server} from "socket.io"
import {Request, Response, NextFunction} from "express"

export const io = new Server({
    cors: {
        origin: true,
        credentials: true
    }
})

export const socketConfig = (request: Request, response: Response, next: NextFunction) => {
    request.io = io
    next()
}
