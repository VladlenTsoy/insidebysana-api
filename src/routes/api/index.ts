import express from "express"
import LoginController from "http/controllers/auth/LoginController"

const router = express.Router()

// Авторизация
router.post("/login", LoginController.validate, LoginController.emailAndPassword)

export default router
