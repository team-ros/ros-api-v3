import { SearchClient } from "../../../elasticsearch/connection"
import { objectModel } from "../../../database/model"
import mime from "mime"

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

export const SerializeResponse = async (search: IRawSearch[]) => {    
    const response = await Promise.all(search.map(async value => {
        return {
            score: value._score,
            id: value._source.id,
            name: value._source.name,
            type: value._source.type ? "file" : "directory",
            ...(await SearchInDatabase(value._source.id))
        }
    }))
    return response
}

const SearchInDatabase = async (id: string) => {
    try {
        const response = await objectModel.findOne({ uuid: id })

        if (response) return {
            parent: response.parent,
            size: response.type ? response.file_size : 0,
            date: response.created_at,
            fileType: response.type ? response.mimeType : undefined,
            fileExtention: response.type ? mime.getExtension(response.mimeType || "") : undefined,
        }
        return {
            error_message: "listing error"
        }
    }
    catch(err) {
        return {
            error_message: "listing error",
            error: err
        }
    }
}