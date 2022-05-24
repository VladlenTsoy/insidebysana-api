exports.up = function (knex) {
    return knex.schema.createTable("print_products", function (table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.string("image").notNullable()
        table.string("thumbnail").notNullable()
        table.integer("product_color_id").notNullable()
        table.integer("print_image_id").notNullable()
        table.integer("hide_id")
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("print_products")
}
