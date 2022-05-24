exports.up = function (knex) {
    return knex.schema.createTable("order_payments", function (table) {
        table.increments("id").notNullable()
        table.integer("order_id").notNullable()
        table.integer("price").notNullable()
        table.integer("payment_id").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("order_payments")
}
