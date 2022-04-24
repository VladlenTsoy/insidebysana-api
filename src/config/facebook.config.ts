import {MessengerClient} from "messaging-api-messenger"

export const facebookClient = new MessengerClient({
    accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN as string,
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    version: process.env.FACEBOOK_APP_VERSION
})
