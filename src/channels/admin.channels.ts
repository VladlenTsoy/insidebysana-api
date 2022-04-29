import {paymeLogger as logger} from "config/logger.config"
import {FacebookChatMessage} from "app/models/facebook-chat/FacebookChatMessage"
import moment from "moment"
import OrderService from "services/order/OrderService"

const UpdateStatusAndPositionOrder = async (socket, data) => {
    try {
        const {order_id, status_id, prev_position, prev_status_id, position} = data
        const order = await OrderService.UpdateStatusAndPosition({
            order_id,
            status_id,
            prev_position,
            prev_status_id,
            position
        })
        if (order) socket.broadcast.emit("order_update", order)
    } catch (e) {
        if (e instanceof Error) logger.error(e.stack)
    }
}

const CheckCountNewMessages = async (socket) => {
    try {
        const count = await FacebookChatMessage.query().where({read_at: null, user_id: null})
        socket.emit("count_new_messages", count.length)
    } catch (e) {
        if (e instanceof Error) logger.error(e.stack)
    }
}

const ReadNewMessage = async (socket, data) => {
    try {
        await FacebookChatMessage.query<any>().findById(data.id).update({read_at: moment().format("YYYY-MM-DD HH:mm:ss")})
        await CheckCountNewMessages(socket)
    } catch (e) {
        if (e instanceof Error) logger.error(e.stack)
    }
}

export default {UpdateStatusAndPositionOrder, CheckCountNewMessages, ReadNewMessage}
