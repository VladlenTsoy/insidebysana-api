import {ProductStorage} from "models/product/ProductStorage"

export default {
    /**
     * Вывод всех мест хранений
     * @param req
     * @param res
     * @constructor
     */
    GetAll: async (req, res) => {
        const productStorages = await ProductStorage.query()
        return res.send(productStorages)
    }
}
