
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id')
        table.string('full_name')
        table.string('photo')
        table.string('email').notNullable()
        table.string('password').notNullable()
        table.enum('access', ['admin', 'manager']).notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
