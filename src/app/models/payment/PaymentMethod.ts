import Model from "config/knex.config"
import moment from "moment"

export class PaymentMethod extends Model {
    static tableName = "payment_methods"
    static virtualAttributes = ["url_logo"]
    logo: string
    created_at: string
    updated_at: string

    url_logo() {
        if (this.logo) return `${process.env.APP_IMAGE_URL}/${this.logo}`
    }

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}
