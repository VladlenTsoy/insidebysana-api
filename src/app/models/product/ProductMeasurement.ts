import Model from "config/knex.config"
import moment from "moment"

export class ProductMeasurement extends Model {
    static tableName = "product_measurements"
    static jsonAttributes = ["descriptions"]
    created_at: string
    updated_at: string

    static get jsonSchema() {
        return {
            type: "object",
            required: ["product_id", "title", "descriptions"],
            properties: {
                id: {type: "integer"},
                product_id: {type: "number"},
                title: {type: "string"},
                sizes: {
                    type: "object",
                    properties: {
                        type: {type: "string"},
                        value: {type: "string"}
                    }
                },
                created_at: {type: "string"},
                updated_at: {type: "string"}
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
