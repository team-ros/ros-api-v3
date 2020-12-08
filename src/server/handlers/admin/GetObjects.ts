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
        const response = await objectModel.find(JSON.parse(JSON.stringify({
            owner: options.userid,
            uuid: options.object_id
        })))
        .limit(options.limit || 9999999)
        .skip(options.offset || 0)

        console.log("DATABASE_RESPONSE:", response)
        if(response) return response
        return false
    }
    catch(err) {
        return false
    }
}

export const Serialize = async () => {
    
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
                        must: [
                            {
                                match: { 
                                    uuid: options.object_id
                                }
                            },
                            {
                                match: {
                                    owner: options.userid
                                }
                            }
                        ]
                    }
                }
            }
        })

        console.log("ELASTIC_QUERY:", elasticQuery)

        const response = await SearchClient.search(JSON.parse(elasticQuery))

        console.log("SEARCH RESULTS:", response.body.hits.hits)

        return response.body.hits.hits
    }
    catch(err) {
        console.log("SEARCH ERROR:", err)
        return false
    }
}