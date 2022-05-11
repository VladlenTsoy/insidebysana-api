import Model from "config/knex.config"
import moment from "moment"
import {ProductColor} from "./ProductColor"
import {ProductMeasurement} from "./ProductMeasurement"

export class Product extends Model {
    static tableName = "products"
    static virtualAttributes = ["url_image"]
    static jsonAttributes = ["properties", "tags_id"]
    image: string
    created_at: string
    updated_at: string

    url_image() {
        if (this.image)
            return `${process.env.APP_IMAGE_URL}/${this.image}`
    }

    static get modifiers() {
        return {
            filterCategory(builder, categoryId) {
                builder.whereRaw(`category_id IN (SELECT id FROM categories WHERE category_id = ${categoryId})`)
            }
        }
    }

    // static get jsonSchema() {
    //     return {
    //         type: "object",
    //         // required: ['category_id', 'title', 'price'],
    //         properties: {
    //             id: {type: "integer"},
    //             category_id: {type: "number"},
    //             title: {type: "string"},
    //             image: {type: "string"},
    //             properties: {
    //                 type: "array",
    //                 items: {
    //                     title: {type: "string"},
    //                     description: {type: "string"}
    //                 }
    //             },
    //             price: {type: "number"},
    //             tags_id: {
    //                 type: "array",
    //                 items: {
    //                     type: "string"
    //                 }
    //             },
    //             created_at: {type: "string"},
    //             updated_at: {type: "string"}
    //         }
    //     }
    // }

    static get relationMappings() {
        return {
            colors: {
                filter: query => query.select(),
                relation: Model.HasManyRelation,
                modelClass: ProductColor,
                join: {
                    from: "products.id",
                    to: "product_colors.product_id"
                }
            },
            measurements: {
                filter: query => query.select(),
                relation: Model.HasManyRelation,
                modelClass: ProductMeasurement,
                join: {
                    from: "products.id",
                    to: "product_measurements.product_id"
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
