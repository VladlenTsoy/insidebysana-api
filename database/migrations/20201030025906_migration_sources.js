
exports.up = function(knex) {
    return knex.schema.createTable('sources', function (table) {
        table.increments('id')
        table.string('title').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('sources')
};
