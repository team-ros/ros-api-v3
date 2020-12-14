import { objectModel } from "../../../database/model"
import { SearchClient } from "../../../elasticsearch/connection"

export const RemoveObjectFromDatabase = async (uuid: string) => {
    try {
        const response = await objectModel.deleteOne({ uuid })
        if(response) return true
        return false
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}

export const RemoveObjectFromElasticsearch = async (uuid: string) => {
    try {
        const response = await SearchClient.deleteByQuery({
            index: String(process.env.ELASTIC_INDEX),
            type: "_doc",
            body: {
                query: {
                    match: { id: uuid }
                }
            }
        })

        return true
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}