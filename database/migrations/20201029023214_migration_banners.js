
exports.up = function(knex) {
    return knex.schema.createTable('banners', function (table) {
        table.increments('id')
        table.string('title').notNullable()
        table.string('image')
        table.string('button_title').notNullable()
        table.string('button_link').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('banners')
};
