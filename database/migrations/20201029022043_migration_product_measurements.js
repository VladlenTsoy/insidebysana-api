
exports.up = function(knex) {
    return knex.schema.createTable('product_measurements', function (table) {
        table.increments('id')
        table.string('title').notNullable()
        table.jsonb('descriptions').notNullable()
        table.integer('product_id').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('product_measurements')
};
