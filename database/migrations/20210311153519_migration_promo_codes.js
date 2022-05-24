exports.up = function (knex) {
    return knex.schema.createTable('promo_codes', function (table) {
        table.increments('id').notNullable()
        table.string('code').notNullable()
        table.enum('type', ['percent', 'fixed']).notNullable()
        table.integer('discount').notNullable()
        table.enum('status', ['active', 'inactive']).defaultTo('active')
        table.integer('client_id')
        table.date('end_at')
        table.timestamps(true, true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('promo_codes')
};
