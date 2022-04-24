import express from "express"
import UserController from "app/http/controllers/UserController"
import CategoryController from "app/http/controllers/common/CategoryController"
import SizeController from "app/http/controllers/common/SizeController"
import ImageController from "app/http/controllers/common/ImageController"

const router = express.Router()

// Вывод данных
router.get("/", UserController.GetCurrent)
// Выход
router.delete("/logout", UserController.Logout)

// Вывод всех категорий
router.get("/categories", CategoryController.GetAll)

// Вывод всех размеров
router.get("/sizes", SizeController.GetAll)

//
router.post("/image/upload", ImageController.Upload)
//
router.post("/image/delete", ImageController.Delete)

export default router
