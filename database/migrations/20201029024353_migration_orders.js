exports.up = function(knex) {
    return knex.schema.createTable("orders", function(table) {
        table.increments("id")
        table.enum("type", ["pos", "site"]).defaultTo("pos")
        table.integer("client_id")
        table.integer("source_id")
        table.integer("delivery_id")
        table.string("total_price").notNullable()
        table.json("discount")
        table.json("promo_code")
        table.string("user_id")
        table.integer("payment_state").defaultTo(0)
        table.integer("status_id").defaultTo(1)
        table.integer("payment_id").defaultTo(3)
        table.integer("position").notNullable()
        table.boolean("processing").notNullable().defaultTo(false)
        table.integer("client_source_id")
        table.integer("client_source_comment")
        table.boolean("is_archive")
        table.timestamp("delete_at")
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable("orders")
}
