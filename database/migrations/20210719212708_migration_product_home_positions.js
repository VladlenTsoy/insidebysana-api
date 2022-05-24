exports.up = function (knex) {
    return knex.schema.createTable("product_home_positions", function (table) {
        table.increments("id").notNullable()
        table.integer("product_color_id")
        table.integer("position")
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("product_home_positions")
}
