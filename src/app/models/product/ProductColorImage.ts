import Model from "config/knex.config"
import moment from "moment"

export class ProductColorImage extends Model {
    static tableName = "product_color_images"
    static hidden = ["updated_at"]
    static virtualAttributes = ["url", "status"]
    path: string
    created_at: string
    updated_at: string

    url() {
        if (this.path) return `${process.env.APP_URL}/${this.path}`
    }

    status() {
        return "done"
    }

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}
