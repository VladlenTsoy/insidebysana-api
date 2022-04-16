import {createLogger, format, transports} from "winston"

const {combine, timestamp, prettyPrint} = format

const appLogger = createLogger({
    level: "info",
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        prettyPrint()
    ),
    transports: [new transports.Console(), new transports.File({filename: "logs/error.log", level: "error"})]
})

export default {
    app: appLogger
}
