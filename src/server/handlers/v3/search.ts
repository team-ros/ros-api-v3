import { Query } from "mongoose"
import { SearchClient } from "../../../elasticsearch/connection"

interface IRawSearch {
    _id: string
    _index: string
    _score: number
    _type: string
    _source: {
        id: string
        name: string
        owner: string
        type: boolean
    }
}

export const SearchObject = async (query: string, owner: String): Promise<IRawSearch[] | false> => {
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

export const SerializeResponse = (search: IRawSearch[]) => {
    return search.map(value => {
        return {
            score: value._score,
            id: value._source.id,
            name: value._source.name,
            type: value._source.type ? "file" : "directory"
        }
    })
}