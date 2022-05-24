exports.up = function(knex) {
    return knex.schema.createTable("sizes", function(table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.integer("hide_id")
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable("sizes")
}
