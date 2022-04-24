import {ClientAddress} from "models/ClientAddress"

const GetAll = async (req, res) => {
    const user = req.user
    const addresses = await ClientAddress.query()
        .join("countries", "countries.id", "client_addresses.country")
        .join("cities", "cities.id", "client_addresses.city")
        .where({client_id: user.id})
        .select(
            "client_addresses.id",
            "client_addresses.title",
            "client_addresses.phone",
            "client_addresses.full_name",
            "client_addresses.address",
            "client_addresses.position",
            "client_addresses.country",
            "client_addresses.city",
            "countries.name as country_name",
            "cities.name as city_name"
        )
    return res.send(addresses)
}

const Create = async (req, res) => {
    const user = req.user
    const data = req.body

    const address = await ClientAddress.query().insertAndFetch({...data, client_id: user.id})
    return res.send(address)
}

const Delete = async (req, res) => {
    const {id} = req.params

    await ClientAddress.query().deleteById(id)
    return res.send({status: "success"})
}

export default {GetAll, Create, Delete}
