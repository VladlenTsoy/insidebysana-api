exports.up = function (knex) {
    return knex.schema.createTable("client_addresses", function (table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.string("full_name").notNullable()
        table.string("phone").notNullable()
        table.string("country")
        table.string("city")
        table.text("address")
        table.jsonb("position")
        table.string("client_id").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("client_addresses")
}
