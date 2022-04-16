import express from "express"
import HomeController from "controllers/HomeController"
import ColorController from "controllers/staff/settings/ColorController"

const router = express.Router()

// Статистика
router.post("/home/statistic", HomeController.getStatistic)

// Создать цвет
router.post("/color", ColorController.createValidate, ColorController.create)
// Редактировать цвет
router.patch("/color/:id", ColorController.createValidate, ColorController.edit)
// Удаление цвета
router.delete("/color/:id", ColorController.delete)
// Вывод всех цветов
router.get("/colors", ColorController.getAll)
//
router.patch("/color/:id/hide", ColorController.hide)
//
router.patch("/color/:id/display", ColorController.display)

export default router
