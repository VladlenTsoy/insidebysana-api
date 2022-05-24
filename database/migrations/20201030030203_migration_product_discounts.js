exports.up = function (knex) {
    return knex.schema.createTable("product_discounts", function (table) {
        table.increments("id")
        table.float("discount").notNullable()
        table.integer("product_color_id").notNullable()
        table.dateTime("end_at")
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("product_discounts")
}
