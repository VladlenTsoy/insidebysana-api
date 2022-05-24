exports.up = function (knex) {
    return knex.schema.createTable("order_product_colors", function (table) {
        table.increments("id")
        table.integer("product_color_id").notNullable()
        table.integer("order_id").notNullable()
        table.integer("size_id").notNullable()
        table.integer("qty").notNullable()
        table.integer("price").notNullable()
        table.boolean("promotion").notNullable()
        table.integer("discount").defaultTo(0)
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("order_product_colors")
}
