import Model from "config/knex.config"
import moment from "moment"

export class Country extends Model {
    static tableName = "countries"
    static hidden = ["flag", "updated_at"]
    static virtualAttributes = ["url_flag"]
    flag: string
    created_at: string
    updated_at: string

    url_flag() {
        if (this.flag) return `${process.env.APP_URL}/${this.flag}`
    }

    $beforeInsert() {
        this.created_at = moment().format("YYYY-MM-DD HH:mm:ss")
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }

    $beforeUpdate() {
        this.updated_at = moment().format("YYYY-MM-DD HH:mm:ss")
    }
}
