exports.up = function(knex) {
    return knex.schema.createTable("product_colors", function(table) {
        table.increments("id")
        table.string("title").notNullable()
        table.integer("product_id").notNullable()
        table.integer("color_id").notNullable()
        table.string("thumbnail")
        table.jsonb("sizes_props").notNullable()
        table.jsonb("sizes").notNullable()
        table.enum("status", ["draft", "published", "archive", "ending"]).defaultTo("draft")
        table.jsonb("tags_id")
        table.integer("hide_id")
        table.boolean("is_new")
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable("product_colors")
}
