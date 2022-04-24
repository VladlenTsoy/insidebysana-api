import Model from "../../../config/knex.config"
import moment from "moment"

export class Status extends Model {
    static tableName = 'statuses'
    static jsonAttributes = ['sms', 'conditions']
    created_at: string
    updated_at: string

    $beforeInsert() {
        this.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
        this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    }

    $beforeUpdate() {
        this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    }
}
