import Model from "config/knex.config"
import moment from "moment"

export class Banner extends Model {
    static tableName = "banners"
    static hidden = ["image"]
    static virtualAttributes = ["url_image", "url_image_mobile"]
    image: string
    image_mobile: string
    created_at: string
    updated_at: string

    url_image() {
        if (this.image)
            return `${process.env.APP_IMAGE_URL}/${this.image}`
    }

    url_image_mobile() {
        if (this.image_mobile)
            return `${process.env.APP_IMAGE_URL}/${this.image_mobile}`
    }

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}
