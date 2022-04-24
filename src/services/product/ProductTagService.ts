import {Tag} from "models/settings/Tag"

/**
 * Найти или создать тег по названию
 * @param tags
 * @return {Promise<[]>}
 * @constructor
 */
const FindOrCreate = async (tags) => {
    const tagsId: any[] = []
    if (tags && tags.length)
        await Promise.all(
            tags.map(
                async tag => {
                    // let tagQuery = await Tag.query().findOne('title', 'LIKE', `%${tag}%`)
                    let tagQuery = await Tag.query<any>().findOne("id", "=", tag)
                    if (!tagQuery)
                        tagQuery = await Tag.query<any>().insertAndFetch({title: tag})
                    tagsId.push(String(tagQuery.id))
                }
            )
        )
    return tagsId
}

export default {FindOrCreate}
