exports.up = function (knex) {
    return knex.schema.createTable('cart', function (table) {
        table.increments('id').notNullable()
        table.string('sku').notNullable()
        table.integer('qty').defaultTo(1)
        table.integer('user_id').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('cart')
};
