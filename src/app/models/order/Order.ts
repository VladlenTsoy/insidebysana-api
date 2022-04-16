import Model from "config/knex.config"
import moment from "moment"

export class Order extends Model {
    static tableName = "orders"
    static jsonAttributes = ["promo_code", "discount"]
    total_price!: number
    total!: number
    created_at!: string
    updated_at!: string

    static get relationMappings() {
        const {Client} = require("../Client")
        const {User} = require("../User")
        const {Status} = require("./Status")
        const {Delivery} = require("../settings/Delivery")
        const {OrderAddress} = require("./OrderAddress")
        const {OrderPayment} = require("./OrderPayment")
        const {OrderAdditionalService} = require("./OrderAdditionalService")
        const {ProductColor} = require("../products/ProductColor")

        return {
            client: {
                filter: query => query.select("clients.id", "clients.full_name", "clients.phone"),
                relation: Model.HasOneRelation,
                modelClass: Client,
                join: {
                    from: "orders.client_id",
                    to: "clients.id"
                }
            },
            status: {
                filter: query => query.select("statuses.id", "statuses.title"),
                relation: Model.HasOneRelation,
                modelClass: Status,
                join: {
                    from: "orders.status_id",
                    to: "statuses.id"
                }
            },
            user: {
                filter: query => query.select("users.id", "users.full_name"),
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: "orders.user_id",
                    to: "users.id"
                }
            },
            delivery: {
                filter: query => query.select("delivery.id", "delivery.title", "delivery.price"),
                relation: Model.HasOneRelation,
                modelClass: Delivery,
                join: {
                    from: "orders.delivery_id",
                    to: "delivery.id"
                }
            },
            address: {
                filter: query =>
                    query.select(
                        "order_addresses.full_name",
                        "order_addresses.phone",
                        "order_addresses.country",
                        "order_addresses.city",
                        "order_addresses.address"
                    ),
                relation: Model.HasOneRelation,
                modelClass: OrderAddress,
                join: {
                    from: "orders.id",
                    to: "order_addresses.order_id"
                }
            },
            payments: {
                filter: query =>
                    query
                        .join("payment_methods", "payment_methods.id", "order_payments.payment_id")
                        .select("order_payments.payment_id", "order_payments.price", "payment_methods.title"),
                relation: Model.HasManyRelation,
                modelClass: OrderPayment,
                join: {
                    from: "orders.id",
                    to: "order_payments.order_id"
                }
            },
            additionalServices: {
                filter: query =>
                    query.select(
                        "order_additional_services.id",
                        "order_additional_services.title",
                        "order_additional_services.qty",
                        "order_additional_services.price"
                    ),
                relation: Model.HasManyRelation,
                modelClass: OrderAdditionalService,
                join: {
                    from: "orders.id",
                    to: "order_additional_services.order_id"
                }
            },
            productColors: {
                filter: query =>
                    query
                        .join("products", "products.id", "product_colors.product_id")
                        .join("sizes", "sizes.id", "order_product_colors.size_id")
                        .join("colors", "colors.id", "product_colors.color_id")
                        .select(
                            "product_colors.title",
                            "product_colors.id",
                            "product_colors.thumbnail",
                            "order_product_colors.size_id",
                            "order_product_colors.qty",
                            "order_product_colors.price",
                            "order_product_colors.discount",
                            "sizes.title as size_title",
                            "colors.title as color_title"
                        ),
                relation: Model.ManyToManyRelation,
                modelClass: ProductColor,
                join: {
                    from: "orders.id",
                    through: {
                        from: "order_product_colors.order_id",
                        to: "order_product_colors.product_color_id"
                    },
                    to: "product_colors.id"
                }
            }
        }
    }

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}
