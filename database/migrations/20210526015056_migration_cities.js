exports.up = function (knex) {
    return knex.schema.createTable("cities", function (table) {
        table.increments("id").notNullable()
        table.string("name").notNullable()
        table.integer("country_id").notNullable()
        table.json("position").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("countries")
}
