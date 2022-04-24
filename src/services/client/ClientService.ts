import {Client} from "models/Client"

/**
 * Поиск клиента по телефону и добавление его
 * @param {*} phone
 * @param data
 * @returns
 */
const FindOrCreateClientByPhone = async (phone, data) => {
    let client = await Client.query().findOne({phone})
    if (!client)
        // Создание клиента
        client = await Client.query().insertAndFetch(data)
    return client
}

export default {FindOrCreateClientByPhone}
