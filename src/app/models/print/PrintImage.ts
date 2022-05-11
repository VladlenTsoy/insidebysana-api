import Model from "config/knex.config"
import moment from "moment"
import {PrintCategory} from "./PrintCategory"

export class PrintImage extends Model {
    static tableName = "print_images"
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
            // Категория
            category: {
                filter: query => query.select("id", "title"),
                relation: Model.HasOneRelation,
                modelClass: PrintCategory,
                join: {
                    from: "print_images.category_id",
                    to: "print_categories.id"
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
