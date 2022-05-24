exports.up = function (knex) {
    return knex.schema.createTable("order_addresses", function (table) {
        table.increments("id").notNullable()
        table.string("full_name").notNullable()
        table.string("phone").notNullable()
        table.string("country")
        table.string("city")
        table.text("address")
        table.json("position")
        table.string("order_id").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("order_addresses")
}
