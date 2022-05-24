exports.up = function(knex) {
    return knex.schema.createTable('payme_transactions', function (table) {
        table.increments('id')
        table.string('paycom_transaction_id', 25).notNullable()
        table.string('paycom_time', 13).notNullable()
        table.dateTime('paycom_time_datetime').notNullable()
        table.dateTime('create_time').notNullable()
        table.dateTime('perform_time')
        table.dateTime('cancel_time')
        table.specificType('state', 'tinyint(2)').notNullable()
        table.specificType('reason', 'tinyint(2)')
        table.jsonb('receivers')
        table.integer('order_id').notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('payme_transactions')
};
