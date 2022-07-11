import {ProductMeasurement} from "models/product/ProductMeasurement"

/**
 * Сохранение или обновление обьемов
 * @param measurements
 * @param productId
 * @return {Promise<void>}
 * @constructor
 */
const CreateOrUpdate = async (measurements: any, productId) => {
    const measurementIds = measurements.filter(measurement => !!measurement.id).map(measurement => measurement.id)
    await ProductMeasurement.query()
        .where({product_id: productId})
        .whereNotIn("id", measurementIds)
        .delete()

    await Promise.all(
        Object.values(measurements).map(async (measurement: any) =>
            measurement.id ?
                await ProductMeasurement.query<any>().updateAndFetchById(measurement.id, {
                    title: measurement.title,
                    descriptions: measurement.descriptions,
                    product_id: productId
                }) :
                await ProductMeasurement.query<any>().insertAndFetch({
                    title: measurement.title,
                    descriptions: measurement.descriptions,
                    product_id: productId
                })
        )
    )
}

export default {CreateOrUpdate}
