import Model from "config/knex.config"
import moment from "moment"

export class EskizOauthAccessToken extends Model {
    static tableName = 'eskiz_oauth_access_tokens'
    private created_at: string
    private updated_at: string

    $beforeInsert() {
        this.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
        this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    }

    $beforeUpdate() {
        this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    }
}
