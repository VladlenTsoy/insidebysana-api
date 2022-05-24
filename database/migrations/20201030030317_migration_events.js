
exports.up = function(knex) {
    return knex.schema.createTable('events', function (table) {
        table.increments('id')
        table.integer('status_id').notNullable()
        table.integer('prev_status_id').notNullable()
        table.integer('user_id').notNullable()
        table.integer('order_id').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('events')
};
