import { Query } from "mongoose"
import { SearchClient } from "../../../elasticsearch/connection"

export const SearchObject = async (query: string, owner: String) => {
    try {
        const response = await SearchClient.search({
            index: String(process.env.ELASTIC_INDEX),
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                bool: {
                                    should: [
                                        {
                                            match: {
                                                name: {
                                                    query,
                                                    fuzziness: "AUTO"
                                                }
                                            }
                                        },
                                        {
                                            match: {
                                                contents: {
                                                    query,
                                                    fuzziness: "AUTO"
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
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