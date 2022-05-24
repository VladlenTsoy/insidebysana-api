
exports.up = function(knex) {
    return knex.schema.createTable('clients', function (table) {
        table.increments('id')
        table.string('full_name').notNullable()
        table.string('phone')
        table.string('email')
        table.string('password')
        table.string('instagram')
        table.string('facebook')
        table.string('telegram')
        table.string('source_id').notNullable()
        table.date('date_of_birth')
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('clients')
};
