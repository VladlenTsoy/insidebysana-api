import Bull from "bull"
import {defaultJobOptions} from "config/bull-queue.config"
import OrderService from "services/order/OrderService"

// Очередь на добавление адреса к сделке
const AddAddressToOrder = new Bull("AddAddressToOrder", defaultJobOptions)

// Действие очереди
AddAddressToOrder.process(async ({data}) => {
    const {orderId, information} = data
    await OrderService.AddAddressToOrder(orderId, information)
})

// Очередь на добавление продуктов к сделке
const AddProductsToOrder = new Bull("AddProductsToOrder", defaultJobOptions)

// Действие очереди
AddProductsToOrder.process(async ({data}) => {
    const {orderId, products} = data
    await OrderService.AddProductsToOrder(orderId, products)
})

// Очередь на добавление доп. услуг к сделке
const AddAdditionalServiceToOrder = new Bull(
    "AddAdditionalServiceToOrder",
    defaultJobOptions
)

// Действие очереди
AddAdditionalServiceToOrder.process(async ({data}) => {
    const {orderId, additionalServices} = data
    await OrderService.AddAdditionalServicesToOrder(orderId, additionalServices)
})

// Очередь на добавление оплаты к сделке
const AddPaymentsToOrder = new Bull("AddPaymentsToOrder", defaultJobOptions)

// Действие очереди
AddPaymentsToOrder.process(async ({data}) => {
    const {orderId, payments} = data
    await OrderService.AddPaymentsToOrder(orderId, payments)
})

// Очередь на изменения статуса или позиции у ордера
const UpdateStatusAndPositionToOrder = new Bull(
    "UpdateStatusAndPositionToOrder",
    defaultJobOptions
)

// Действие очереди
UpdateStatusAndPositionToOrder.process(async ({data}: any) => {
    await OrderService.UpdateStatusAndPosition(data)
})

// Очередь на отмену сделки
const AddTimerForCancelOrder = orderId => {
    console.log(orderId)
    const BullTimerForCancelOrder = new Bull(
        "AddTimerForCancelOrder",
        defaultJobOptions
    )
    // Действие очереди
    BullTimerForCancelOrder.process(async ({data}) => {
        try {
            const {orderId} = data
            await OrderService.AddTimerForCancelOrder(orderId)
        } catch (e) {
            // logger.error(e.stack)
        }
    })

    BullTimerForCancelOrder.add({orderId}, {delay: 2 * 3600000})
}

export default {
    AddAddressToOrder,
    AddProductsToOrder,
    AddAdditionalServiceToOrder,
    UpdateStatusAndPositionToOrder,
    AddPaymentsToOrder,
    AddTimerForCancelOrder
}
