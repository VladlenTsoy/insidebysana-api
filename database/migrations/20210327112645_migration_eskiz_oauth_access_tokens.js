exports.up = function (knex) {
    return knex.schema.createTable("eskiz_oauth_access_tokens", function (table) {
        table.string("token").notNullable()
        table.datetime("expires_at").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("eskiz_oauth_access_tokens")
}
