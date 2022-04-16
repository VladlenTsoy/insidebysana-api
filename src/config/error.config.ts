import {NextFunction, Request, Response} from "express"
import loggerConfig from "config/logger.config"

export default {
    // Логирование ошибок
    logErrors: (err: Error, req: Request, res: Response, next: NextFunction) => {
        loggerConfig.app.error(err.stack)
        next(err)
    },
    // Вывод ошибки для клиента
    clientErrorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.xhr) {
            res.status(500).send({error: "Something failed!"})
        } else {
            next(err)
        }
    },
    // Вывод ошибки
    errorHandler: (err: Error, req: Request, res: Response) => {
        return res.status(500).send({error: err.message})
    }
}
