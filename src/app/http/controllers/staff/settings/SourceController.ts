const {Source} = require('models/settings/Source')
const {logger} = require("config/logger.config")
const {body, validationResult} = require('express-validator');

/**
 * Вывод всех
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const GetAll = async (req, res) => {
    try {
        const sources = await Source.query()
            .select('id', 'title')
        return res.send(sources)
    } catch (e) {
        logger.error(e.stack)
        return res.status(500).send({message: e.message})
    }
}

const CreateValidate = [
    body('title').not().isEmpty().withMessage('Введите название ресурса!'),
]

/**
 * Создать ресурс
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const Create = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});

    try {
        const {title} = req.body
        const source = await Source.query()
            .insertAndFetch({title})
        return res.send(source)
    } catch (e) {
        logger.error(e.stack)
        return res.status(500).send({message: e.message})
    }
}

/**
 * Редактирование ресурса
 * @param req
 * @param res
 * @return {Promise<*>}
 * @constructor
 */
const EditById = async (req, res) => {
    // Ошибка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});

    try {
        const {id} = req.params
        const {title} = req.body
        const source = await Source.query()
            .updateAndFetchById(id, {title})
        return res.send(source)
    } catch (e) {
        logger.error(e.stack)
        return res.status(500).send({message: e.message})
    }
}

module.exports = {GetAll, Create, CreateValidate, EditById}