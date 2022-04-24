import {Client} from "models/Client"

/**
 * Вывод по поиску
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetBySearch = async (req, res) => {
    const {search} = req.body

    const clients = await Client.query()
        .select("id", "full_name", "email", "phone")
        .modify("search", search)

    return res.send(clients)
}

export default {GetBySearch}
