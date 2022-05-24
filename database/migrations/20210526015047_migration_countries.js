exports.up = function (knex) {
    return knex.schema.createTable("countries", function (table) {
        table.increments("id").notNullable()
        table.string("name").notNullable()
        table.string("flag").notNullable()
        table.json("position").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable("countries")
}
