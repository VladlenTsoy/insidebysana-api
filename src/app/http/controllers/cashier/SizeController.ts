import {Size} from "models/settings/Size"

/**
 * Вывод всех размеров
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const sizes = await Size.query()
        .whereRaw(
            `id IN (
                    SELECT product_sizes.size_id FROM product_sizes 
                    WHERE product_sizes.qty > 0
                )`
        )
        .select("id", "title")
    return res.send(sizes)
}

export default {GetAll}
