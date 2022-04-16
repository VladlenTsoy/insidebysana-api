import Model from "config/knex.config"
import moment from "moment"

export class Color extends Model {
    static tableName = "colors"
    static hidden = ["updated_at"]
    created_at: string
    updated_at: string

    static get modifiers() {
        return {
            // Только опубликованные
            published(builder) {
                builder
                    .whereNotNull("product_colors.thumbnail")
                    .where("product_colors.status", "published")
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
