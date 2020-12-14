import { objectModel } from "../../../database/model"
import { SearchClient } from "../../../elasticsearch/connection"

export const CheckIfExistsDatabase = async (uuid: string) => {
    try {
        const response = await objectModel.findOne({ uuid })

        if(response) return true
        return false
    }
    catch(err) {
        return false
    }
}

export const CheckIfExistsElasticsearch = async (uuid: string) => {
    try {
        const response = await SearchClient.search({
            index: String(process.env.ELASTIC_INDEX),
            body: {
                query: {
                    bool: {
                        must: [
                            { match: { uuid }}
                        ]
                    }
                }
            }
        })

        if(response.body.hits.hits.length) return true
        return false
    }
    catch(err) {
        return false
    }
}