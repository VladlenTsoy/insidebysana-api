import Model from "config/knex.config"
import moment from "moment"

export class PrintCategory extends Model {
    static tableName = "print_categories"
    static hidden = ["image"]
    static virtualAttributes = ["url_image"]
    image: string
    created_at: string
    updated_at: string

    url_image() {
        if (this.image)
            return `${process.env.APP_URL}/${this.image}`
    }

    static get relationMappings() {
        return {
            // Категория
            sub_categories: {
                filter: query => query.select("id", "title", "category_id"),
                relation: Model.HasManyRelation,
                modelClass: PrintCategory,
                join: {
                    from: "print_categories.id",
                    to: "print_categories.category_id"
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
