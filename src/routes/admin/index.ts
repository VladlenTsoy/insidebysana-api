import express from "express"
import HomeController from "controllers/staff/HomeController"
import ColorController from "controllers/staff/settings/ColorController"
import TagController from "controllers/staff/settings/TagController"
import CategoryController from "controllers/staff/settings/CategoryController"
import SizeController from "controllers/staff/settings/SizeController"
import BannerController from "controllers/staff/settings/BannerController"
import LookbookController from "controllers/staff/settings/LookbookController"
import LookbookCategoryController from "controllers/staff/settings/LookbookCategoryController"
import NewsletterController from "controllers/staff/settings/NewsletterController"
import AdditionalServiceController from "controllers/staff/settings/AdditionalServiceController"
import ClientController from "controllers/staff/ClientController"
import StatusController from "controllers/staff/StatusController"
import OrderController from "controllers/staff/OrderController"
import UserController from "controllers/staff/UserController"
import SourceController from "controllers/staff/settings/SourceController"
import PaymentMethodController from "controllers/staff/payment/PaymentMethodController"
import PromoCodeController from "controllers/staff/settings/PromoCodeController"
import DeliveryController from "controllers/staff/settings/DeliveryController"
import PrintCategoryController from "controllers/staff/settings/print/PrintCategoryController"
import PrintImageController from "controllers/staff/settings/print/PrintImageController"
import PrintProductController from "controllers/staff/settings/print/PrintProductController"
import HomeProductController from "controllers/staff/HomeProductController"
import ProductColorController from "controllers/staff/ProductColorController"
import ProductController from "controllers/staff/ProductController"
import ProductColorImageController from "controllers/staff/ProductColorImageController"
import ProductStorageController from "controllers/staff/ProductStorageController"
import multer from "multer"

const upload = multer()
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


// Вывод всех тегов
router.get("/tags", TagController.GetAll)
// Изменить тег
router.patch("/tag/:id", TagController.Edit)
// Удалить тег
router.delete("/tag/:id", TagController.Delete)

// Вывод всех статусов
router.get("/statuses", StatusController.GetAll)
// Обновление статуса
router.patch("/status/:id", StatusController.Update)
// Обновление позиции статуса
router.patch("/status/:id/position", StatusController.UpdatePosition)
// Создание статуса
router.post("/status", StatusController.Create)
// Вывод сделки по статусу
router.get("/orders", OrderController.GetByAll)
// Создание сделки
router.post("/order", OrderController.Create)
// Отмена сделки
router.post("/order/:id/cancel", OrderController.Cancel)
// Отправить сделку в корзину
router.post("/order/:id/hide", OrderController.Hide)
//
router.post("/order/:id/archive", OrderController.SendToArchive)
// Вывод адреса сделки
router.get("/order/:id/address", OrderController.GetAddressByOrderId)
// Вывод товаров сделки
router.get("/order/:id/products", OrderController.GetProductsByOrderId)
// Изменить статус оплаты у сделки
router.patch("/order/:id/payment-state", OrderController.ChangePaymentState)
//
router.get("/order/:id/edit", OrderController.GetForEditById)
//
router.patch("/order/:id", OrderController.EditById)
//
router.post("/orders-archive", OrderController.GetArchiveByDates)
//
router.get("/order/:id", OrderController.GetById)

// Вывод всех активных категорий
router.get("/categories", CategoryController.GetByActive)
// Создание категории
router.post("/category", CategoryController.Create)
// Редактирование категории
router.patch("/category/:id", CategoryController.Edit)
// Удалить категорию
router.delete("/category/:id", CategoryController.Delete)

// Создание размеров
router.post("/size", SizeController.Create)
// Редактировать цвет
router.patch("/size/:id", SizeController.Edit)
// Удаление цвета
router.delete("/size/:id", SizeController.Delete)
//
router.patch("/size/:id/hide", SizeController.Hide)
//
router.patch("/size/:id/display", SizeController.Display)

// Вывод всех используемых категорий
router.get("/filter/categories", CategoryController.GetByFilter)
// Вывод всех используемых размеров
router.get("/filter/sizes", SizeController.GetByFilter)

// Вывод клиентов по поиску
router.post("/clients", ClientController.GetBySearch)
// Вывод клиентов в таблице
router.post("/clients/table", ClientController.GetAllPaginate)
// Создание клиента
router.post("/client", ClientController.Create)
// Вывод клиента
router.get("/client/:id", ClientController.GetById)
// Редактировать клиента
router.patch("/client/:id", ClientController.Edit)
// Вывод корзины клиента
router.get("/client/:id/cart", ClientController.GetProductsByCart)
// Вывод избранных клиента
router.get("/client/:id/wishlist", ClientController.GetProductsByWishlist)
// Вывод сделок
router.get("/client/:id/orders", ClientController.GetOrdersByClientId)

// Ресурсы
router.get("/sources", SourceController.GetAll)
// Создать ресурс
router.post("/source", SourceController.CreateValidate, SourceController.Create)
// Редактирование ресурса
router.patch("/source/:id", SourceController.CreateValidate, SourceController.EditById)

// Баннеры
router.get("/banners", BannerController.GetAll)
// Создать баннер
router.post("/banner", BannerController.CreateValidate, BannerController.Create)
// Редактирование баннера
router.patch("/banner/:id", BannerController.CreateValidate, BannerController.EditById)
// Удаление баннера
router.delete("/banner/:id", BannerController.DeleteById)

// Пользователи
router.post("/users", UserController.GetAllPaginate)
// Создать пользователя
router.post("/user", UserController.CreateValidate, UserController.Create)
// Редактировать пользователя
router.post("/user/:id", UserController.Edit)

// Вывод всех методов оплаты
router.get("/payment-methods", PaymentMethodController.GetAll)

// Вывод всех lookbook
router.get("/category/:categoryId/lookbook", LookbookController.GetByCategoryId)
// Создать lookbook
router.post("/lookbook", LookbookController.CreateValidate, LookbookController.Create)
// Редактирование lookbook
router.patch("/lookbook/:id", LookbookController.CreateValidate, LookbookController.EditById)
// Удаление lookbook
router.delete("/lookbook/:id", LookbookController.DeleteById)
// Вывод категорий для лукбука
router.get("/lookbook-categories", LookbookCategoryController.GetAll)
// Создать категорию для лукбука
router.post("/lookbook-category", LookbookCategoryController.Create)
// Редактировать категорию для лукбука
router.patch("/lookbook-category/:id", LookbookCategoryController.EditById)
// Удалить категорию
router.delete("/lookbook-category/:id", LookbookCategoryController.Delete)

// Вывод всех подписанных
router.get("/newsletter", NewsletterController.GetAll)

// Вывод всех промокодов
router.get("/promo-codes", PromoCodeController.GetAll)
// Создание промокода
router.post("/promo-code", PromoCodeController.CreateValidate, PromoCodeController.Create)
// Редактирование промокода
router.patch("/promo-code/:id", PromoCodeController.CreateValidate, PromoCodeController.Edit)

// Вывод доставки для формы
router.get("/deliveries/select/:country", DeliveryController.GetForSelectByCountry)

// Вывод всех дополнительных услуг
router.get("/additional-services", AdditionalServiceController.getAll)
// Создание дополнительной услуги
router.post("/additional-service", AdditionalServiceController.create)
// Редатирование дополнительной услуги
router.patch("/additional-service/:id", AdditionalServiceController.edit)
// Удаление дополнительной услуги
router.delete("/additional-service/:id", AdditionalServiceController.delete)

// Создание печать-категории
router.post("/print-category", PrintCategoryController.Create)
// Редактирование печать-категории
router.patch("/print-category/:id", PrintCategoryController.Edit)
// Удалить печать-категорию
router.delete("/print-category/:id", PrintCategoryController.Delete)

// Вывод всех изображений для печати
router.get("/print-images", PrintImageController.GetAll)
// Добавление изображения для печати
router.post("/print-image", PrintImageController.Create)
// Редактирование печать картинки
router.patch("/print-image/:id", PrintImageController.Edit)
// Удаление картинки для печати
router.delete("/print-image/:id", PrintImageController.Delete)

// Вывод всех продуктов по ID картинки для печати
router.get("/print-products/:print_image_id", PrintProductController.GetByPrintImageId)
// Добавление изображения для печати
router.post("/print-product", PrintProductController.Create)
// Редактирование печать картинки
router.patch("/print-product/:id", PrintProductController.Edit)
// Удалить товар печати
router.delete("/print-product/:id", PrintProductController.Delete)

// Вывод всех продуктов для дом. страницы
router.get("/home-products", HomeProductController.GetAll)
// Добавить продукт для дом. страницы
router.post("/home-product", HomeProductController.Create)
// Изменить продукт для дом. страницы
router.patch("/home-product/:id", HomeProductController.Edit)
// Удалить продукт с дом. страницы
router.delete("/home-product/:id", HomeProductController.Delete)
// Выбрать свободные позиции на главной странице
router.get("/home-position/free/:position", HomeProductController.GetFree)


/*** NEW ***/

// Поиск продукта
router.post("/product-colors", ProductColorController.GetBySearch)
// Создание продукта
router.post("/product", ProductController.Create)
// Вывод продукта по id
router.get("/product/:id", ProductController.GetById)
// редактировать продукта по id
router.post("/product/edit/:id", ProductController.EditById)
// Вывод всех продуктов
router.post("/product-colors/table", ProductColorController.GetAllPaginate)
// Удаление товара
router.delete("/product/:productColorId", ProductColorController.Delete)
// Вывод картинок продуктов
router.get("/product-color/:id/images", ProductColorController.GetImagesById)
// Загрузка картинок
router.post(
    "/product-color/:productColorId/image/upload",
    upload.single("image"),
    ProductColorImageController.Upload
)
// Удаление картинки
router.delete("/product-color-image/:id", ProductColorImageController.Delete)

// Вывод всех мест хранений
router.get("/product-storages", ProductStorageController.GetAll)


export default router
