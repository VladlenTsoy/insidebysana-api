exports.up = function(knex) {
    return knex.schema.table("product_colors", function(t) {
        t.integer("storage_id").after("is_new")
    })
}

exports.down = function(knex) {
    return knex.schema.table("product_colors", function(t) {
        t.dropColumn("storage_id")
    })
}
