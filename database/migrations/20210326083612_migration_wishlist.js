exports.up = function (knex) {
    return knex.schema.createTable('wishlist', function (table) {
        table.increments('id').notNullable()
        table.string('product_color_id').notNullable()
        table.integer('user_id').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('wishlist')
};
