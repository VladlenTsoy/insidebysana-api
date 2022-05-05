import Arena from "bull-arena"
import Bull from "bull"

const queueNames = [
    "SendMessage",
    "AddAddressToOrder",
    "AddProductsToOrder",
    "AddAdditionalServiceToOrder",
    "UpdateStatusAndPositionToOrder",
    "AddTimerForCancelOrder"
]

const defaultHostConfig = {
    hostId: "redis",
    redis: {
        url: process.env.REDISCLOUD_URL
        // host: process.env.REDIS_HOST,
        // port: Number(process.env.REDIS_PORT)
    }

}

export const arena = Arena(
    {
        Bull,
        queues: queueNames.map(q => ({name: q, ...defaultHostConfig}))
    },
    {
        basePath: "/arena",
        disableListen: true
    }
)
