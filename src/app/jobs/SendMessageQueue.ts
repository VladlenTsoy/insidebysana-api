import Bull from "bull"
import {defaultJobOptions} from "config/bull-queue.config"
import EskizService from "services/notify/EskizService"

/**
 * Конвертирование времени в милисекундах
 * @param {*} m
 * @returns
 */
const convertMinuteByMilliseconds = m => {
    return m * 60000
}

/**
 * Отправление сообщения
 * @param phone
 * @param message
 * @param timeout
 * @return {Promise<void>}
 * @constructor
 */
export const SendMessageQueue = async ({phone, message, timeout}) => {
    // Создание очереди
    const Queue = new Bull("SendMessage", defaultJobOptions)
    const delay = convertMinuteByMilliseconds(timeout)

    // Действие очереди
    Queue.process(async ({data}) => {
        const {phone, message} = data
        return await EskizService.SendMessage(phone, message)
    })

    // Запуск очереди
    Queue.add({phone, message}, {delay})
}
