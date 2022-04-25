import Model from "config/knex.config"
import moment from "moment"
import {ProductColor} from "models/product/ProductColor"
import {Size} from "models/settings/Size"

export class OrderProductColor extends Model {
    static tableName = "order_product_colors"
    created_at: string
    updated_at: string

    static get relationMappings() {
        return {
            product: {
                filter: query => query.withGraphFetched("sizes").select("id", "thumbnail", "product_id", "title"),
                relation: Model.HasOneRelation,
                modelClass: ProductColor,
                join: {
                    from: "order_product_colors.product_color_id",
                    to: "product_colors.id"
                }
            },
            details: {
                filter: query =>
                    query
                        .join("products", "products.id", "product_colors.product_id")
                        .select("product_colors.id", "product_colors.title", "product_colors.thumbnail"),
                relation: Model.HasOneRelation,
                modelClass: ProductColor,
                join: {
                    from: "order_product_colors.product_color_id",
                    to: "product_colors.id"
                }
            },
            size: {
                filter: query => query.select("sizes.id", "sizes.title"),
                relation: Model.HasOneRelation,
                modelClass: Size,
                join: {
                    from: "order_product_colors.size_id",
                    to: "sizes.id"
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
