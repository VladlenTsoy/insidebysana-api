exports.up = function (knex) {
    return knex.schema.createTable("product_sizes", function (table) {
        table.increments("id").notNullable()
        table.integer("product_color_id").notNullable()
        table.integer("size_id").notNullable()
        table.integer("qty").defaultTo(0)
        table.integer("min_qty").defaultTo(0)
        table.integer("cost_price").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("product_sizes")
}
