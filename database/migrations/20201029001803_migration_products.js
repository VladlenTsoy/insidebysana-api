
exports.up = function(knex) {
    return knex.schema.createTable('products', function (table) {
        table.increments('id')
        table.integer('category_id').notNullable()
        table.string('title').notNullable()
        table.jsonb('properties')
        table.integer('price').notNullable()
        table.jsonb('tags_id')
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('products')
};
