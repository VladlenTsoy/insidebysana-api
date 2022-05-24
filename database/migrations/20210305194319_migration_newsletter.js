
exports.up = function(knex) {
    return knex.schema.createTable('newsletter', function (table) {
        table.increments('id').notNullable()
        table.string('email').notNullable()
        table.string('token').notNullable()
        table.enum('status', ['active', 'inactive']).defaultTo('active')
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('newsletter')
};
