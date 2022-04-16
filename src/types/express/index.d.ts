import {Server} from "socket.io"

declare global {
    namespace Express {
        type io = Server

        interface Request {
            io: Server
        }
    }
}
