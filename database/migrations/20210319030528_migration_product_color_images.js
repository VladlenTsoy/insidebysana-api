exports.up = function(knex) {
    return knex.schema.createTable("product_color_images", function(table) {
        table.increments("id").notNullable()
        table.integer("product_color_id").notNullable()
        table.string("name")
        table.string("path")
        table.integer("size")
        table.integer("position").notNullable()
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable("product_color_images")
}
