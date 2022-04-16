import Model from "config/knex.config"
import moment from "moment"

export class SiteOauthAccessToken extends Model {
    static tableName = "site_oauth_access_tokens"
    id: string
    client_id: number
    expires_at: string
    created_at: string
    updated_at: string

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}
