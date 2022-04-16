import Model from "config/knex.config"
import moment from "moment"

export class Category extends Model {
    static tableName = "categories"
    created_at: string
    updated_at: string

    static get modifiers() {
        return {
            onlyActiveCategories(builder) {
                builder.whereRaw(
                    `id IN (
                        SELECT category_id FROM categories 
                        WHERE id IN (
                            SELECT category_id FROM products 
                            WHERE id IN (
                                SELECT product_colors.product_id FROM product_colors 
                                WHERE id IN (
                                    SELECT product_sizes.product_color_id FROM product_sizes 
                                    WHERE product_sizes.qty > 0 AND status = "published" AND thumbnail IS NOT null
                                )
                            )
                        )
                    )`
                )
            },
            onlyActiveSubCategories(builder) {
                builder.whereRaw(
                    `id IN (
                        SELECT category_id FROM products 
                        WHERE id IN (
                            SELECT product_colors.product_id FROM product_colors 
                            WHERE id IN (
                                SELECT product_sizes.product_color_id FROM product_sizes 
                                WHERE product_sizes.qty > 0
                            )
                        )
                    )`
                )
            }
        }
    }

    static get relationMappings() {
        return {
            // Категория
            sub_categories: {
                filter: query => query.select("id", "title", "category_id"),
                relation: Model.HasManyRelation,
                modelClass: Category,
                join: {
                    from: "categories.id",
                    to: "categories.category_id"
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
