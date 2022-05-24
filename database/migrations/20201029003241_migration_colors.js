
exports.up = function(knex) {
    return knex.schema.createTable('colors', function (table) {
        table.increments('id')
        table.string('title').notNullable()
        table.string('hex').notNullable()
        table.integer("hide_id")
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('colors')
};
