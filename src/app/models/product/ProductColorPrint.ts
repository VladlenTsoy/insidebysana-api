import Model from "config/knex.config"
import moment from "moment"

export class ProductColorPrint extends Model {
    static tableName = "product_color_prints"
    static virtualAttributes = ["url", "status", "name", "size", "uid"]
    id!: number
    image!: string
    created_at: string
    updated_at: string

    uid() {
        return String(this.id)
    }

    name() {
        return `image.${this.id}.jpeg`
    }

    size() {
        return 0
    }

    url() {
        if (this.image)
            return `${process.env.APP_IMAGE_URL}/${this.image}`
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
