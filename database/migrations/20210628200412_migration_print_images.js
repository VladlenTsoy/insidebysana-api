exports.up = function (knex) {
    return knex.schema.createTable("print_images", function (table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.string("image").notNullable()
        table.string("thumbnail").notNullable()
        table.integer("category_id").notNullable()
        table.integer("price").notNullable()
        table.integer("hide_id")
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("print_categories")
}
