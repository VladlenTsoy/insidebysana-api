exports.up = function(knex) {
    return knex.schema.createTable("facebook_chat_messages", function(table) {
        table.increments("id").notNullable()
        table.integer("chat_id").notNullable()
        table.string("message").notNullable()
        table.integer("user_id", 20)
        table.integer("send_timestamp", 20).notNullable()
        table.timestamp("delivered_at")
        table.timestamp("read_at")
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable("facebook_chat_messages")
}
