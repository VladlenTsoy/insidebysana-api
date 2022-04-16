import Model from "config/knex.config"
import moment from "moment"

const Password = require("objection-password")()

export class Client extends Model {
    static tableName = "clients"
    static hidden = ["password", "updated_at"]
    created_at: string
    updated_at: string

    static get modifiers() {
        return {
            /**
             * Поиск
             * @param builder
             * @param search
             */
            search(builder, search) {
                if (search.trim() !== "")
                    builder.where((_builder) => {
                        _builder.where("id", "LIKE", `%${search}%`)
                            .orWhere("full_name", "LIKE", `%${search}%`)
                            .orWhere("phone", "LIKE", `%${search}%`)
                            .orWhere("email", "LIKE", `%${search}%`)
                    })
            }
        }
    }

    static get relationMappings() {
        const {Source} = require("../models/settings/Source")

        return {
            source: {
                filter: query => query.select("sources.id", "sources.title"),
                relation: Model.HasOneRelation,
                modelClass: Source,
                join: {
                    from: "clients.source_id",
                    to: "sources.id"
                }
            }
        }
    }

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}

export const ClientPassword = Password(Client)
