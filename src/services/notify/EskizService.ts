import axios from "axios"
import {EskizOauthAccessToken} from "models/auth/EskizOauthAccessToken"
import FormData from "form-data"
import moment from "moment"

const Auth = async () => {
    const form = new FormData()
    form.append("email", process.env.ESKIZ_EMAIL)
    form.append("password", process.env.ESKIZ_PASSWORD)

    return axios({
        url: "https://notify.eskiz.uz/api/auth/login",
        method: "post",
        headers: {
            ...form.getHeaders()
        },
        data: form
    })
}

const CheckAuth = async () => {
    const eskizAuth = await EskizOauthAccessToken.query<any>().findOne("expires_at", ">", "CURDATE()")
    if (eskizAuth) return eskizAuth.token

    const response = await Auth()
    const token = response.data.data.token
    await EskizOauthAccessToken.query().insert({
        token,
        expires_at: moment().add(30, "days").format("YYYY-MM-DD HH:mm:ss")
    })

    return response.data.data.token
}

const Send = async (token, phone, message) => {
    const form = new FormData()
    form.append("mobile_phone", phone)
    form.append("message", message)
    form.append("from", process.env.ESKIZ_FROM)

    const response = await axios({
        url: "https://notify.eskiz.uz/api/message/sms/send",
        method: "post",
        headers: {
            Authorization: `Bearer ${token}`,
            ...form.getHeaders()
        },
        data: form
    })
    // data: {
    // id: 4290927,
    // status: 'waiting',
    // message: 'Waiting for SMS provider'
    //   }
    return response.data
}

const SendMessage = async (phone, message) => {
    const updatePhone = phone.replace(/[^0-9]/g, "")

    const token = await CheckAuth()
    if (token) await Send(token, updatePhone, message)
}

export default {SendMessage}
