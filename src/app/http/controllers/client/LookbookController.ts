import {Lookbook} from "models/settings/Lookbook"
import {LookbookCategory} from "models/settings/LookbookCategory"

const GetLatest = async (req, res) => {
    const lookbookCategory = await LookbookCategory.query<any>()
        .findOne({})
        .orderBy("created_at", "desc")
    if (lookbookCategory)
        lookbookCategory.images = await Lookbook.query()
            .where({category_id: lookbookCategory.id})
            .orderBy("position", "asc")
    return res.send(lookbookCategory)
}

const GetAllExceptId = async (req, res) => {
    const {categoryId} = req.params
    const lookbook = await LookbookCategory.query()
        .whereNot({id: categoryId})
        .orderBy("created_at", "desc")

    return res.send(lookbook)
}

const GetAll = async (req, res) => {
    const lookbook = await LookbookCategory.query().orderBy(
        "created_at",
        "desc"
    )

    return res.send(lookbook)
}

const GetByCategoryId = async (req, res) => {
    const {id} = req.params
    const lookbookCategory = await LookbookCategory.query<any>()
        .findOne({id})
        .orderBy("created_at", "desc")
    if (lookbookCategory)
        lookbookCategory.images = await Lookbook.query()
            .where({category_id: lookbookCategory.id})
            .orderBy("position", "asc")
    return res.send(lookbookCategory)
}

export default {GetLatest, GetAll, GetByCategoryId, GetAllExceptId}
