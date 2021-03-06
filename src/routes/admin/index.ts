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

// ????????????????????
router.post("/home/statistic", HomeController.getStatistic)

// ?????????????? ????????
router.post("/color", ColorController.createValidate, ColorController.create)
// ?????????????????????????? ????????
router.patch("/color/:id", ColorController.createValidate, ColorController.edit)
// ???????????????? ??????????
router.delete("/color/:id", ColorController.delete)
// ?????????? ???????? ????????????
router.get("/colors", ColorController.getAll)
//
router.patch("/color/:id/hide", ColorController.hide)
//
router.patch("/color/:id/display", ColorController.display)


// ?????????? ???????? ??????????
router.get("/tags", TagController.GetAll)
// ???????????????? ??????
router.patch("/tag/:id", TagController.Edit)
// ?????????????? ??????
router.delete("/tag/:id", TagController.Delete)

// ?????????? ???????? ????????????????
router.get("/statuses", StatusController.GetAll)
// ???????????????????? ??????????????
router.patch("/status/:id", StatusController.Update)
// ???????????????????? ?????????????? ??????????????
router.patch("/status/:id/position", StatusController.UpdatePosition)
// ???????????????? ??????????????
router.post("/status", StatusController.Create)
// ?????????? ???????????? ???? ??????????????
router.get("/orders", OrderController.GetByAll)
// ???????????????? ????????????
router.post("/order", OrderController.Create)
// ???????????? ????????????
router.post("/order/:id/cancel", OrderController.Cancel)
// ?????????????????? ???????????? ?? ??????????????
router.post("/order/:id/hide", OrderController.Hide)
//
router.post("/order/:id/archive", OrderController.SendToArchive)
// ?????????? ???????????? ????????????
router.get("/order/:id/address", OrderController.GetAddressByOrderId)
// ?????????? ?????????????? ????????????
router.get("/order/:id/products", OrderController.GetProductsByOrderId)
// ???????????????? ???????????? ???????????? ?? ????????????
router.patch("/order/:id/payment-state", OrderController.ChangePaymentState)
//
router.get("/order/:id/edit", OrderController.GetForEditById)
//
router.patch("/order/:id", OrderController.EditById)
//
router.post("/orders-archive", OrderController.GetArchiveByDates)
//
router.get("/order/:id", OrderController.GetById)

// ?????????? ???????? ???????????????? ??????????????????
router.get("/categories", CategoryController.GetByActive)
// ???????????????? ??????????????????
router.post("/category", CategoryController.Create)
// ???????????????????????????? ??????????????????
router.patch("/category/:id", CategoryController.Edit)
// ?????????????? ??????????????????
router.delete("/category/:id", CategoryController.Delete)

// ???????????????? ????????????????
router.post("/size", SizeController.Create)
// ?????????????????????????? ????????
router.patch("/size/:id", SizeController.Edit)
// ???????????????? ??????????
router.delete("/size/:id", SizeController.Delete)
//
router.patch("/size/:id/hide", SizeController.Hide)
//
router.patch("/size/:id/display", SizeController.Display)

// ?????????? ???????? ???????????????????????? ??????????????????
router.get("/filter/categories", CategoryController.GetByFilter)
// ?????????? ???????? ???????????????????????? ????????????????
router.get("/filter/sizes", SizeController.GetByFilter)

// ?????????? ???????????????? ???? ????????????
router.post("/clients", ClientController.GetBySearch)
// ?????????? ???????????????? ?? ??????????????
router.post("/clients/table", ClientController.GetAllPaginate)
// ???????????????? ??????????????
router.post("/client", ClientController.Create)
// ?????????? ??????????????
router.get("/client/:id", ClientController.GetById)
// ?????????????????????????? ??????????????
router.patch("/client/:id", ClientController.Edit)
// ?????????? ?????????????? ??????????????
router.get("/client/:id/cart", ClientController.GetProductsByCart)
// ?????????? ?????????????????? ??????????????
router.get("/client/:id/wishlist", ClientController.GetProductsByWishlist)
// ?????????? ????????????
router.get("/client/:id/orders", ClientController.GetOrdersByClientId)

// ??????????????
router.get("/sources", SourceController.GetAll)
// ?????????????? ????????????
router.post("/source", SourceController.CreateValidate, SourceController.Create)
// ???????????????????????????? ??????????????
router.patch("/source/:id", SourceController.CreateValidate, SourceController.EditById)

// ??????????????
router.get("/banners", BannerController.GetAll)
// ?????????????? ????????????
router.post("/banner", BannerController.CreateValidate, BannerController.Create)
// ???????????????????????????? ??????????????
router.patch("/banner/:id", BannerController.CreateValidate, BannerController.EditById)
// ???????????????? ??????????????
router.delete("/banner/:id", BannerController.DeleteById)

// ????????????????????????
router.post("/users", UserController.GetAllPaginate)
// ?????????????? ????????????????????????
router.post("/user", UserController.CreateValidate, UserController.Create)
// ?????????????????????????? ????????????????????????
router.post("/user/:id", UserController.Edit)

// ?????????? ???????? ?????????????? ????????????
router.get("/payment-methods", PaymentMethodController.GetAll)

// ?????????? ???????? lookbook
router.get("/category/:categoryId/lookbook", LookbookController.GetByCategoryId)
// ?????????????? lookbook
router.post("/lookbook", LookbookController.CreateValidate, LookbookController.Create)
// ???????????????????????????? lookbook
router.patch("/lookbook/:id", LookbookController.CreateValidate, LookbookController.EditById)
// ???????????????? lookbook
router.delete("/lookbook/:id", LookbookController.DeleteById)
// ?????????? ?????????????????? ?????? ??????????????
router.get("/lookbook-categories", LookbookCategoryController.GetAll)
// ?????????????? ?????????????????? ?????? ??????????????
router.post("/lookbook-category", LookbookCategoryController.Create)
// ?????????????????????????? ?????????????????? ?????? ??????????????
router.patch("/lookbook-category/:id", LookbookCategoryController.EditById)
// ?????????????? ??????????????????
router.delete("/lookbook-category/:id", LookbookCategoryController.Delete)

// ?????????? ???????? ??????????????????????
router.get("/newsletter", NewsletterController.GetAll)

// ?????????? ???????? ????????????????????
router.get("/promo-codes", PromoCodeController.GetAll)
// ???????????????? ??????????????????
router.post("/promo-code", PromoCodeController.CreateValidate, PromoCodeController.Create)
// ???????????????????????????? ??????????????????
router.patch("/promo-code/:id", PromoCodeController.CreateValidate, PromoCodeController.Edit)

// ?????????? ???????????????? ?????? ??????????
router.get("/deliveries/select/:country", DeliveryController.GetForSelectByCountry)

// ?????????? ???????? ???????????????????????????? ??????????
router.get("/additional-services", AdditionalServiceController.getAll)
// ???????????????? ???????????????????????????? ????????????
router.post("/additional-service", AdditionalServiceController.create)
// ?????????????????????????? ???????????????????????????? ????????????
router.patch("/additional-service/:id", AdditionalServiceController.edit)
// ???????????????? ???????????????????????????? ????????????
router.delete("/additional-service/:id", AdditionalServiceController.delete)

// ???????????????? ????????????-??????????????????
router.post("/print-category", PrintCategoryController.Create)
// ???????????????????????????? ????????????-??????????????????
router.patch("/print-category/:id", PrintCategoryController.Edit)
// ?????????????? ????????????-??????????????????
router.delete("/print-category/:id", PrintCategoryController.Delete)

// ?????????? ???????? ?????????????????????? ?????? ????????????
router.get("/print-images", PrintImageController.GetAll)
// ???????????????????? ?????????????????????? ?????? ????????????
router.post("/print-image", PrintImageController.Create)
// ???????????????????????????? ???????????? ????????????????
router.patch("/print-image/:id", PrintImageController.Edit)
// ???????????????? ???????????????? ?????? ????????????
router.delete("/print-image/:id", PrintImageController.Delete)

// ?????????? ???????? ?????????????????? ???? ID ???????????????? ?????? ????????????
router.get("/print-products/:print_image_id", PrintProductController.GetByPrintImageId)
// ???????????????????? ?????????????????????? ?????? ????????????
router.post("/print-product", PrintProductController.Create)
// ???????????????????????????? ???????????? ????????????????
router.patch("/print-product/:id", PrintProductController.Edit)
// ?????????????? ?????????? ????????????
router.delete("/print-product/:id", PrintProductController.Delete)

// ?????????? ???????? ?????????????????? ?????? ??????. ????????????????
router.get("/home-products", HomeProductController.GetAll)
// ???????????????? ?????????????? ?????? ??????. ????????????????
router.post("/home-product", HomeProductController.Create)
// ???????????????? ?????????????? ?????? ??????. ????????????????
router.patch("/home-product/:id", HomeProductController.Edit)
// ?????????????? ?????????????? ?? ??????. ????????????????
router.delete("/home-product/:id", HomeProductController.Delete)
// ?????????????? ?????????????????? ?????????????? ???? ?????????????? ????????????????
router.get("/home-position/free/:position", HomeProductController.GetFree)


/*** NEW ***/

// ?????????? ????????????????
router.post("/product-colors", ProductColorController.GetBySearch)
// ???????????????? ????????????????
router.post("/product", ProductController.Create)
// ?????????? ???????????????? ???? id
router.get("/product/:id", ProductController.GetById)
// ?????????????????????????? ???????????????? ???? id
router.post("/product/edit/:id", ProductController.EditById)
// ?????????? ???????? ??????????????????
router.post("/product-colors/table", ProductColorController.GetAllPaginate)
// ???????????????? ????????????
router.delete("/product/:productColorId", ProductColorController.Delete)
// ?????????? ???????????????? ??????????????????
router.get("/product-color/:id/images", ProductColorController.GetImagesById)
// ???????????????? ????????????????
router.post(
    "/product-color/:productColorId/image/upload",
    upload.single("image"),
    ProductColorImageController.Upload
)
// ???????????????? ????????????????
router.delete("/product-color-image/:id", ProductColorImageController.Delete)

// ?????????? ???????? ???????? ????????????????
router.get("/product-storages", ProductStorageController.GetAll)
// ?????????????? ????????????
router.post("/product-storage", ProductStorageController.CreateValidate, ProductStorageController.Create)
// ???????????????????????????? ??????????????
router.patch("/product-storage/:id", ProductStorageController.CreateValidate, ProductStorageController.EditById)

export default router
