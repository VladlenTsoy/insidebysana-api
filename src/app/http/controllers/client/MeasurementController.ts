import {ProductMeasurement} from "models/product/ProductMeasurement"
import {Size} from "models/settings/Size"

const GetByProductId = async (req, res) => {
    const {productId} = req.params
    const measurement = await ProductMeasurement.query<any>()
        .where({product_id: productId})

    const _measurements: any = {
        product_id: productId,
        titles: [],
        sizes: []
    }

    if (measurement) {
        _measurements.titles = measurement.map((measurement) => measurement.title)
        const a = measurement.map((measurement) => measurement.descriptions)
        const b = a.reduce((state, value) => {
            Object.entries(value).map(val => {
                if (typeof state[val[0]] === "object")
                    state[val[0]].push(val[1])
                else if (typeof state[val[0]] === "undefined")
                    return state[val[0]] = [val[1]]
            })
            return state
        }, {})

        _measurements.sizes = await Promise.all(
            Object.entries(b).map(async ([key, val]) => {
                const size = await Size.query<any>().findById(key).select("id", "title")
                return {
                    name: size ? size.title : "Н/Д",
                    descriptions: val
                }
            })
        )
    }

    return res.send(_measurements)
}

export default {GetByProductId}
