import Model from "config/knex.config"
import moment from "moment"

export class OrderAddress extends Model {
    static tableName = "order_addresses"
    static jsonAttributes = ["position"]
    updated_at: string
    created_at: string

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}
