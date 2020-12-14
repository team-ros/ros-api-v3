import { objectModel } from "../../../database/model"
import { SearchClient } from "../../../elasticsearch/connection"

interface IOptionsGetFromQuery {
    limit?: number
    offset?: number
    userid?: string
    object_id?: string
}

export const SearchOnDatabase = async (options: IOptionsGetFromQuery) => {
    try {

        const DatabaseQuery = JSON.stringify({
            owner: options.userid,
            uuid: options.object_id
        })

        const response = await objectModel.find(JSON.parse(DatabaseQuery))
        .limit(options.limit || 9999999)
        .skip(options.offset || 0)

        if(response) return response
        return false
    }
    catch(err) {
        return false
    }
}

export const SearchOnElasticsearch = async (options: IOptionsGetFromQuery) => {
    try {

        const elasticQuery = JSON.stringify({
            index: String(process.env.ELASTIC_INDEX),
            from: options.offset,
            size: options.limit,
            body: {
                query: {
                    bool: {
                        must: ElasticQueryBuilder({ uuid: options.object_id, owner: options.userid })
                    }
                }
            }
        })


        const response = await SearchClient.search(JSON.parse(elasticQuery))

        return response.body.hits.hits
    }
    catch(err) {
        console.log("SEARCH ERROR:", err)
        return false
    }
}

const ElasticQueryBuilder = (options: { uuid?: string, owner?: string }) => {
    let rtarr = []
    if(options.uuid) rtarr.push({ match: { uuid: options.uuid }})
    if(options.owner) rtarr.push({ match: { owner: options.owner }})

    return rtarr
}