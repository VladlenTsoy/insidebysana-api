import {Model} from "objection"
import moment from "moment"

export class StaffOauthAccessToken extends Model {
    static tableName = "crm_oauth_access_tokens"
    id: number
    user_id: number
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
