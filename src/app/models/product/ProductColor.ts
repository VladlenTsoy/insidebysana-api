import Model from "config/knex.config"
import moment from "moment"
import {raw} from "objection"
import {Product} from "./Product"
import {ProductColorImage} from "./ProductColorImage"
import {Color} from "models/settings/Color"
import {Category} from "models/settings/Category"
import {ProductDiscount} from "./ProductDiscount"
import {ProductMeasurement} from "./ProductMeasurement"
import {ProductSize} from "./ProductSize"
import {ProductStorage} from "./ProductStorage"

export class ProductColor extends Model {
    static tableName = "product_colors"
    static virtualAttributes = ["url_thumbnail", "b_sizes", "b_props"]
    static jsonAttributes = ["tags_id"]
    static hidden = ["thumbnail"]
    thumbnail: string
    created_at: string
    updated_at: string

    url_thumbnail() {
        if (this.thumbnail) return `${process.env.APP_IMAGE_URL}/${this.thumbnail}`
    }

    static get modifiers() {
        return {
            /**
             * Фильтр по категориям
             * @param builder
             * @param categoryId
             */
            filterCategory(builder, categoryId) {
                if (
                    categoryId &&
                    categoryId.match(/^\d+/) &&
                    Number(categoryId) !== 0
                )
                    builder.whereRaw(
                        `product_id IN (SELECT id FROM products WHERE category_id IN (SELECT id FROM categories WHERE category_id = ${categoryId}))`
                    )
            },

            /**
             * Фильтр по подкатегориям
             * @param builder
             * @param subCategoryId
             */
            filterSubCategory(builder, subCategoryId) {
                if (Number(subCategoryId) !== 0)
                    builder.whereRaw(
                        `product_id IN (SELECT id FROM products WHERE category_id = ${subCategoryId})`
                    )
            },

            /**
             * Фильтр по подкатегориям ids
             * @param builder
             * @param subCategoryIds
             */
            filterSubCategoryIn(builder, subCategoryIds) {
                if (subCategoryIds && subCategoryIds.length)
                    builder.whereRaw(
                        `product_id IN (SELECT id FROM products WHERE category_id IN (${subCategoryIds.join(
                            ","
                        )}))`
                    )
            },

            /**
             * Поиск
             * @param builder
             * @param search
             */
            search(builder, search) {
                if (search && search.trim() !== "") {
                    builder
                        .whereRaw(`product_colors.title LIKE '%${search}%'`)
                        .orWhere("product_colors.id", "LIKE", `%${search}%`)
                }
            },

            /**
             * Фильтрация по размерам
             * @param builder
             * @param sizes
             */
            filterSizes(builder, sizes) {
                if (sizes && sizes.length)
                    builder.whereRaw(
                        `product_colors.id IN (
                            SELECT product_sizes.product_color_id FROM product_sizes 
                            WHERE product_sizes.size_id IN (${sizes.join(",")})
                        )`
                    )
            },

            /**
             * Фильтрация по tags
             * @param builder
             * @param tags
             */
            filterTags(builder, tags) {
                if (tags && tags.length)
                    builder
                        .join("tags", raw(`tags.id IN (${tags.join(", ")})`))
                        .whereRaw(
                            `JSON_SEARCH(product_colors.tags_id, 'all', tags.id) > 1`
                        )
            },

            /**
             * Фильтрация по цветам
             * @param builder
             * @param colors
             */
            filterColors(builder, colors) {
                if (colors && colors.length)
                    builder.where(_builder =>
                        colors.map(color => _builder.orWhere({color_id: color}))
                    )
            },

            /**
             * Фильтрация по цене
             * @param builder
             * @param price
             */
            filterPrice(builder, price) {
                if (price && price.max !== 0)
                    builder.whereRaw(
                        `product_id IN (SELECT id FROM products WHERE price BETWEEN ${price.min} AND ${price.max})`
                    )
            }
        }
    }

    static get relationMappings() {
        return {
            details: {
                filter: query => query.select("products.id", "products.price"),
                relation: Model.HasOneRelation,
                modelClass: Product,
                join: {
                    from: "product_colors.product_id",
                    to: "products.id"
                }
            },
            category: {
                filter: query =>
                    query.select("categories.id", "categories.title"),
                relation: Model.HasOneThroughRelation,
                modelClass: Category,
                join: {
                    from: "product_colors.product_id",
                    through: {
                        from: "products.id",
                        to: "products.category_id"
                    },
                    to: "categories.id"
                }
            },
            colors: {
                filter: query =>
                    query.select(
                        "colors.id",
                        "colors.title",
                        "colors.hex",
                        "product_colors.id as product_id"
                    ),
                relation: Model.ManyToManyRelation,
                modelClass: Color,
                join: {
                    from: "product_colors.product_id",
                    through: {
                        from: "product_colors.product_id",
                        to: "product_colors.color_id"
                    },
                    to: "colors.id"
                }
            },
            color: {
                filter: query =>
                    query.select("colors.id", "colors.title", "colors.hex"),
                relation: Model.HasOneRelation,
                modelClass: Color,
                join: {
                    from: "product_colors.color_id",
                    to: "colors.id"
                }
            },
            sizes: {
                filter: query =>
                    query
                        .join("sizes", "sizes.id", "product_sizes.size_id")
                        .select(
                            "sizes.title",
                            "product_sizes.id",
                            "product_sizes.size_id",
                            "product_sizes.qty",
                            "product_sizes.min_qty",
                            "product_sizes.cost_price"
                        )
                        .orderBy("sizes.id", "asc")
                        .groupBy("id"),
                relation: Model.HasManyRelation,
                modelClass: ProductSize,
                join: {
                    from: "product_colors.id",
                    to: "product_sizes.product_color_id"
                }
            },
            discount: {
                filter: query =>
                    query
                        .where(builder => {
                            builder
                                .where(
                                    "product_discounts.end_at",
                                    ">=",
                                    new Date()
                                )
                                .orWhere("product_discounts.end_at", null)
                        })
                        .andWhere("product_discounts.discount", "!=", 0)
                        .select(
                            "product_discounts.discount",
                            "product_discounts.end_at"
                        ),
                relation: Model.HasOneRelation,
                modelClass: ProductDiscount,
                join: {
                    from: "product_colors.id",
                    to: "product_discounts.product_color_id"
                }
            },
            tags: {
                filter: query =>
                    query
                        .select("tags.id as tag_id", "tags.title")
                        .join(
                            "tags",
                            raw(
                                `JSON_SEARCH(product_colors.tags_id, 'all', tags.id) > 1`
                            )
                        )
                        .select("tags.id", "tags.title"),
                relation: Model.HasManyRelation,
                modelClass: ProductColor,
                join: {
                    from: "product_colors.id",
                    to: "product_colors.id"
                }
            },
            images: {
                filter: query =>
                    query
                        .orderBy("position", "asc")
                        .select("id", "name", "path", "size"),
                relation: Model.HasManyRelation,
                modelClass: ProductColorImage,
                join: {
                    from: "product_colors.id",
                    to: `product_color_images.product_color_id`
                }
            },
            measurements: {
                filter: query =>
                    query.select("id", "title", "product_id", "descriptions"),
                relation: Model.HasManyRelation,
                modelClass: ProductMeasurement,
                join: {
                    from: "product_colors.product_id",
                    to: `product_measurements.product_id`
                }
            },
            storage: {
                filter: query => query.select("id", "title"),
                relation: Model.HasOneRelation,
                modelClass: ProductStorage,
                join: {
                    from: "product_colors.storage_id",
                    to: `product_storages.id`
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

export class ProductColorSelectEdit extends ProductColor {
    static virtualAttributes = ["size_ids", "size_props"]
    static hidden = ["sizes"]
    private sizes: any

    size_ids() {
        if (this.sizes) return this.sizes.map(size => size.size_id)
    }

    size_props() {
        if (this.sizes)
            return this.sizes.reduce(
                (acc, size) => ({...acc, [size.size_id]: size}),
                {}
            )
    }
}
