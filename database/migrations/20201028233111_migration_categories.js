
exports.up = function(knex) {
    return knex.schema.createTable('categories', function (table) {
        table.increments('id')
        table.string('title').notNullable()
        table.integer('category_id')
        table.string('url').notNullable()
        table.integer('hide_id')
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('categories')
};
