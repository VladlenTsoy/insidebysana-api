exports.up = function(knex) {
    return knex.schema.createTable("product_storages", function(table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable("product_storages")
}
