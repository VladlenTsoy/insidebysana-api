exports.up = function (knex) {
    return knex.schema.createTable("lookbook_categories", function (table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.string("image").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("lookbook_categories")
}
