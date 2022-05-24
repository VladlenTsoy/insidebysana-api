exports.up = function (knex) {
    return knex.schema.createTable("lookbook", function (table) {
        table.increments("id").notNullable()
        table.string("image")
        table.integer("category_id")
        table.integer("position").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("lookbook")
}
