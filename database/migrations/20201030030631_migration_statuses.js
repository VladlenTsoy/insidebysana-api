
exports.up = function(knex) {
    return knex.schema.createTable('statuses', function (table) {
        table.increments('id')
        table.string('title').notNullable()
        table.jsonb('sms')
        table.jsonb('conditions')
        table.jsonb('email')
        table.enum('access', ['admin', 'manager'])
        table.boolean('fixed').defaultTo(0)
        table.integer('position').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('statuses')
};
