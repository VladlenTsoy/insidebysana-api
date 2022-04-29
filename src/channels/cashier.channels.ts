import {paymeLogger} from "config/logger.config"

const CreateOrderFormPos = async (socket, data) => {
    try {

    } catch (e) {
        if (e instanceof Error) paymeLogger.error(e.stack)
    }
}

module.exports = {CreateOrderFormPos}
