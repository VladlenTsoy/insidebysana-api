exports.up = function (knex) {
    return knex.schema.createTable("print_categories", function (table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.string("image")
        table.integer("category_id")
        table.integer("hide_id")
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("print_categories")
}
