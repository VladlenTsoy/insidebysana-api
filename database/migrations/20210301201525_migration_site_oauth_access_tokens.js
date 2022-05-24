
exports.up = function(knex) {
    return knex.schema.createTable('site_oauth_access_tokens', function (table) {
        table.string('id').notNullable()
        table.integer('client_id').notNullable()
        table.dateTime('expires_at').notNullable()
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('site_oauth_access_tokens')
};
