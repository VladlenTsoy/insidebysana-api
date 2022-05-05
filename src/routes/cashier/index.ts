import express from "express"
import ProductColorController from "controllers/cashier/ProductColorController"
import ClientController from "controllers/cashier/ClientController"
import OrderController from "controllers/cashier/OrderController"
import AdditionalServiceController from "controllers/cashier/AdditionalServiceController"
import PaymentMethodController from "controllers/cashier/PaymentMethodController"
import CategoryController from "controllers/cashier/CategoryController"
import SizeController from "controllers/cashier/SizeController"

const router = express.Router()

// Поиск товаров
router.post("/search-products", ProductColorController.GetBySearch)

// Поиск клиентов
router.post("/clients", ClientController.GetBySearch)

// Сделки
router.post("/orders", OrderController.GetAll)

// Создать заказ
router.post("/pos/order", OrderController.Create)

// Посик по SKU
router.post("/product-color/sku", ProductColorController.GetBySKU)

// Доп. услуги
router.get("/additional-services", AdditionalServiceController.GetAll)

// Вывод платежных систем
router.get("/payment-methods", PaymentMethodController.GetAll)

// Вывод всех категорий
router.get("/categories", CategoryController.GetAll)

// Вывод всех размеров
router.get("/sizes", SizeController.GetAll)

export default router
