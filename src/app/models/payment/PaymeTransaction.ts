import Model from "config/knex.config"

export class PaymeTransaction extends Model {
    static tableName = "payme_transactions"

    id: number
    order_id: number
    state: number
    paycom_transaction_id: string
    paycom_time: string
    paycom_time_datetime: string
    create_time: string
    perform_time: string | null
    cancel_time: string | null
    reason: number | null
    receivers: object | null
}
