import Model from "config/knex.config"
import moment from "moment"
import {ProductColor} from "models/product/ProductColor"

export class PrintProduct extends Model {
    static tableName = "print_products"
    static hidden = ["image", "thumbnail"]
    static virtualAttributes = ["url_image", "url_thumbnail"]
    image: string
    thumbnail: string
    created_at: string
    updated_at: string

    url_image() {
        if (this.image) return `${process.env.APP_IMAGE_URL}/${this.image}`
    }

    url_thumbnail() {
        if (this.thumbnail) return `${process.env.APP_IMAGE_URL}/${this.thumbnail}`
    }

    static get relationMappings() {
        return {
            //
            product_color: {
                filter: query =>
                    query
                        .join("products", "products.id", "product_colors.product_id")
                        .join("colors", "colors.id", "product_colors.color_id")
                        .select("product_colors.id", "products.title", "colors.title as color_title"),
                relation: Model.HasOneRelation,
                modelClass: ProductColor,
                join: {
                    from: "print_products.product_color_id",
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
