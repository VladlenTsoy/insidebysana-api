export const defaultJobOptions = {
    // removeOnComplete: true,
    // removeOnFail: false
    redis: {
        url: process.env.REDISCLOUD_URL
        // port: Number(process.env.REDIS_PORT),
        // host: process.env.REDIS_HOST
    }
}

export const limiter = {
    max: 10000,
    duration: 1000,
    bounceBack: false
}

export const settings = {
    lockDuration: 600000, // Время истечения срока действия ключа для блокировок заданий
    stalledInterval: 5000, // Как часто проверять наличие приостановленных заданий (используйте 0, чтобы никогда не проверять).
    maxStalledCount: 2, // Максимальное количество повторных обработок зависшего задания.
    guardInterval: 5000, // Интервал опроса отложенных и добавленных заданий.
    retryProcessDelay: 30000, // Задержка перед обработкой следующего задания в случае внутренней ошибки.
    drainDelay: 5 // Тайм-аут, когда очередь находится в опустошенном состоянии (пустое ожидание заданий).
}

export const redis = {
    redis: {
        url: process.env.REDISCLOUD_URL
        // port: Number(process.env.REDIS_PORT),
        // host: process.env.REDIS_HOST
    }
}
