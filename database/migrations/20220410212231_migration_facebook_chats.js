exports.up = function(knex) {
    return knex.schema.createTable("facebook_chats", function(table) {
        table.increments("id").notNullable()
        table.integer("client_id")
        table.bigInteger("facebook_client_id").notNullable()
        table.json("facebook_client")
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable("facebook_chats")
}
