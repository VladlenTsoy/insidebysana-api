import Model from "config/knex.config"
import moment from "moment"

export class Size extends Model {
    static tableName = "sizes"
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
