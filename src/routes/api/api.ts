import express from "express"
import LoginController from "controllers/auth/LoginController"
import ProductColorController from "controllers/client/ProductColorController"
import MeasurementController from "controllers/client/MeasurementController"
import CategoryController from "controllers/client/CategoryController"
import PrintCategoryController from "controllers/common/PrintCategoryController"
import PrintImageController from "controllers/common/PrintImageController"
import PrintProductController from "controllers/common/PrintProductController"
import BannerController from "controllers/client/BannerController"
import WishlistController from "controllers/client/WishlistController"
import CartController from "controllers/client/CartController"
import ClientAuthController from "controllers/client/AuthController"
import LookbookController from "controllers/client/LookbookController"
import NewsletterController from "controllers/client/NewsletterController"
import PromoCodeController from "controllers/client/PromoCodeController"
import PaymeController from "controllers/client/PaymeController"
import DeliveryController from "controllers/client/DeliveryController"
import OrderController from "controllers/client/OrderController"
import CityController from "controllers/common/CityController"
import CountryController from "controllers/common/CountryController"
import AdditionalServicesController from "controllers/client/AdditionalServicesController"

const router = express.Router()

// Вывод банеров (Главная)
router.get("/banners", BannerController.GetAll)
// Вывод категорий (Главная)
router.get("/categories", CategoryController.GetAll)

// Вывод новых продуктов (Главная)
router.get("/new-products", ProductColorController.GetNew)

//
router.get("/product/ids", ProductColorController.GetIds)

// Вывод цветов продукта (Каталог)
router.post("/product-colors", ProductColorController.GetPagination)

// Вывод цвета продукта по ID (Продукт)
router.get("/product-color/:id", ProductColorController.GetById)
// Вывод обмеров по продукту ID (Продукт)
router.get("/measurements/:productId", MeasurementController.GetByProductId)
// Вывод похожих по продукту ID (Продукт) (ТЕГИ)
router.get("/featured-products/:productId", ProductColorController.GetByProductId)
// Недавно просмотренные продукты (Продукт)
router.post("/recent-products", ProductColorController.GetByRecentIds)

// Вывод по поиску (Поиск)
router.post("/search-products", ProductColorController.SearchValidate, ProductColorController.Search)

// Авторизация
router.post("/login", LoginController.validate, LoginController.emailAndPassword)
// Авторизация клиента
router.post("/client/login", ClientAuthController.LoginValidate, ClientAuthController.Login)
// Регистрация клиента
router.post(
    "/client/registration",
    ClientAuthController.RegistrationValidate,
    ClientAuthController.Registration
)

// Вывод списка желаемого
router.post("/wishlist", WishlistController.GetAll)

// Вывод всей корзины
router.post("/cart", CartController.GetAll)

// Лукбук
router.get("/lookbook", LookbookController.GetLatest)
//
router.get("/lookbook/category/:id", LookbookController.GetByCategoryId)
//
router.get("/lookbook-categories", LookbookController.GetAll)
//
router.get("/lookbook-categories/:categoryId", LookbookController.GetAllExceptId)
// Подписаться
router.post("/newsletter/subscribe", NewsletterController.SubscribeValidate, NewsletterController.Subscribe)
// Промокод
router.post("/promo-code", PromoCodeController.GetPromoCodeByCode)

//
router.post("/payme", PaymeController.Index)

// Вывод доставки
router.post("/delivery", DeliveryController.GetByCountry)

//
router.post("/order", OrderController.Create)
// Вывод сделки по id
router.get("/order/:id", OrderController.GetById)
//
router.post("/order/pay", OrderController.Pay)
//
router.get("/order-list", OrderController.GetOrderList)

// Вывод всех стран
router.get("/countries", CountryController.GetAll)

// Вывод городов
router.get("/cities/:countryId", CityController.GetByCountryId)

//
router.get("/additional-services", AdditionalServicesController.GetAll)

//
router.get("/print-categories", PrintCategoryController.GetAll)

//
router.get("/print-images", PrintImageController.GetAll)

//
router.get("/print-image/:print_image_id/products", PrintProductController.GetByPrintImageId)

//
router.get("/print-image/products/latest", PrintProductController.GetLatest)

//
router.get("/print-product/:id", PrintProductController.GetById)

//
router.get("/print-images/:category_id", PrintImageController.GetByCategoryID)

export default router
