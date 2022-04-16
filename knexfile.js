module.exports = {
    development: {
        client: "mysql2",
        version: "5.8",
        jsonDatatype: "JSON",
        connection: {
            host: "141.8.192.26",
            user: "a0493480_insidebysana",
            password: "ZSUQq4Ee",
            database: "a0493480_old_insidebysana"
            // database: 'a0493480_insidebysana',
        },
        migrations: {
            directory: `${__dirname}/database/migrations`
        },
        seeds: {
            directory: `${__dirname}/database/seeds`
        }
    },

    production: {
        client: "mysql2",
        connection: {
            database: process.env.DB_TABLE,
            user: process.env.DB_LOGIN,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    }
}
