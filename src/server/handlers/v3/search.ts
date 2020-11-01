import { response } from "express"
import { SearchClient } from "../../../elasticsearch/connection"

export const SearchObject = async (query: string, owner: String) => {
    try {
        const response = await SearchClient.search({
            index: "ros",
            body: {
                query: {
                    bool: {
                        should: [
                            { 
                                term: {
                                    name: query
                                }
                            },
                            {
                                term: {
                                    content: query
                                }
                            }
                        ],
                        must: [
                            {
                                match: {
                                    owner
                                }
                            }
                        ]
                    }
                }
            }
        })
        return response.body.hits.hits
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}