
exports.up = function(knex) {
    return knex.schema.createTable('payment_methods', function (table) {
        table.increments('id')
        table.string('title').notNullable()
        table.string('logo').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('payment_methods')
};
