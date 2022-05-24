
exports.up = function(knex) {
    return knex.schema.createTable('product_color_prints', function (table) {
        table.increments('id')
        table.integer('product_color_id').notNullable()
        table.string('image')
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('product_prints')
};
