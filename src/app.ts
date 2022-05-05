import "dotenv/config"
import "module-alias/register"
import express from "express"
import path from "path"
import logger from "morgan"
import {corsConfig} from "config/cors.config"
import {socketConfig, io} from "config/socket.config"
import i18n from "config/i18n.config"
import errorConfig from "config/error.config"
import {socketPassport} from "middleware/socket.middleware"
import apiRouter from "routes/api/api"
import userRouter from "routes/api/user"
import clientRouter from "routes/api/client"
import cashierRouter from "./routes/cashier"
// import managerRouter from "./routes/manager"
import adminRouter from "routes/admin"
import facebookRouter from "routes/api/facebook"
/* Промежуточная проверка */
import clientPassportMiddleware from "middleware/client-password.middleware"
import staffPassportMiddleware from "middleware/staff-passport.middleware"
import channels from "channels"

export const app = express()

app.use(corsConfig)
app.use(socketConfig)
app.use(i18n.init)

app.use(logger("dev"))
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "../public")))
app.use(express.static(path.join(__dirname, "resources")))


/* Сокеты */
// @ts-ignore
io.use(socketPassport)
io.on("connection", channels)


app.use("/api", apiRouter)
app.use("/api/client", clientPassportMiddleware, clientRouter)
app.use("/api/user", staffPassportMiddleware, userRouter)
app.use("/api/user/cashier", staffPassportMiddleware, cashierRouter)
// app.use("/api/user/manager", staffPassportMiddleware, managerRouter)
app.use("/api/user/admin", staffPassportMiddleware, adminRouter)
app.use("/api/facebook", facebookRouter)

app.use(errorConfig.logErrors)
app.use(errorConfig.clientErrorHandler)
app.use(errorConfig.errorHandler)
