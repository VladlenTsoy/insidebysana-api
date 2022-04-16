import {Model} from "objection"
import moment from "moment"
import Password from "objection-password"

export class User extends Model {
    static tableName = 'users'
    static hidden = ['password']
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
                if (search.trim() !== '')
                    builder.where((_builder) => {
                        _builder.where('id', 'LIKE', `%${search}%`)
                            .orWhere('full_name', 'LIKE', `%${search}%`)
                            .orWhere('email', 'LIKE', `%${search}%`)
                    });
            },
        }
    }

    $beforeInsert() {
        this.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
        this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    }

    $beforeUpdate() {
        this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    }
}

export const UserPassword = Password()(User)
