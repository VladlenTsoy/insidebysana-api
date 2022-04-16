import {Delivery} from "models/settings/Delivery"

const GetForSelectByCountry = async (req, res) => {
    const {country} = req.params
    const deliveries = await Delivery.query().where({country}).select("id", "title", "price")

    return res.send(deliveries)
}

export default {GetForSelectByCountry}
