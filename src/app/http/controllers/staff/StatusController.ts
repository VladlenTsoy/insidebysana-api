import {Status} from "models/order/Status"
import {raw} from "objection"
import {Response} from "express"

/**
 * Вывод всех сделок
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    const statuses = await Status.query().select("*")
    return res.send(statuses)
}

/**
 * Создать статус
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    const {title, sms, access} = req.body
    const lastStatus = await Status.query<any>().orderBy("position", "desc").findOne({})
    const status = await Status.query<any>().insertAndFetch({
        title,
        position: lastStatus ? lastStatus.position + 1 : 0,
        access,
        fixed: 0,
        sms
    })
    return res.send(status)
}

/**
 * Обновление
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Update = async (req, res: Response) => {
    const {id} = req.params
    const {title, conditions, sms, access} = req.body
    const data: any = {title, access}

    if (sms) data.sms = sms
    else data.sms = null

    if (conditions) data.conditions = conditions
    else data.conditions = null

    const status = await Status.query<any>().updateAndFetchById(id, data)
    return res.send(status)
}

/**
 * Обновление позиции
 * @return {Promise<*>}
 * @constructor
 */
const UpdatePosition = async (req, res) => {
    const {id} = req.params
    const {position, prev_position} = req.body
    const status = await Status.query<any>().updateAndFetchById(id, {position: position})
    if (position < prev_position) {
        await Status.query<any>()
            .where("position", ">=", position)
            .where("position", "<=", prev_position)
            .whereNot({id: status.id})
            .update({position: raw("position + 1")})
    } else if (position > prev_position) {
        await Status.query<any>()
            .where("position", ">=", prev_position)
            .where("position", "<=", position)
            .whereNot({id: status.id})
            .update({position: raw("position - 1")})
    }
    return res.send({status: "success"})
}

export default {GetAll, Update, Create, UpdatePosition}
