exports.up = function(knex) {
    return knex.schema.createTable("additional_services", function(table) {
        table.increments("id").notNullable()
        table.string("title").notNullable()
        table.integer("price").notNullable()
        table.json("display").notNullable()
        table.string("image")
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable("additional_services")
}
