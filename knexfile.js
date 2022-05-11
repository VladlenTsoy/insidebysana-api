module.exports = {
    development: {
        client: "mysql2",
        version: "5.8",
        jsonDatatype: "JSON",
        connection: {
            host: process.env.DB_HOST || "141.8.192.26",
            user: process.env.DB_LOGIN || "a0493480_insidebysana",
            password: process.env.DB_PASSWORD || "ZSUQq4Ee",
            database: process.env.DB_TABLE || "a0493480_old_insidebysana"
            // database: 'a0493480_new_insidebysana',
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
