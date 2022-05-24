exports.up = function (knex) {
    return knex.schema.createTable("order_additional_services", function (table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.integer("qty").notNullable()
        table.integer("price").notNullable()
        table.integer("order_id").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("order_additional_services")
}
