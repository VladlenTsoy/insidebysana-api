import Model from "config/knex.config"
import moment from "moment"

export class ProductSize extends Model {
    static tableName = "product_sizes"
    created_at: string
    updated_at: string

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}
