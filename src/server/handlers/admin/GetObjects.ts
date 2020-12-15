import { Iobject, objectModel } from "../../../database/model"
import { SearchClient } from "../../../elasticsearch/connection"

interface IElasticResponse {
    _index: string
    _type: string
    _score: number
    _source: {
        type: boolean
        name: string
        owner: string
        id: string
        contents?: string
    }
}

export const Search = async (options: { userid?: string; object_id?: string; search?: string}) => {
    try {
        const DatabaseResponse = await SearchInDatabase(options)
        const ElasticResponse = await SearchInElasticsearch(options)

        if(!DatabaseResponse) return {
            status: false,
            error: "database query error"
        }

        if(!ElasticResponse) return {
            status: false,
            error: "elasticsearch query error"
        }

        return SerializeResponses(DatabaseResponse, ElasticResponse)
        
    }
    catch(err) {
        return {
            status: false,
            message: "internal server error",
            debug: err
        }
    }
}

const SerializeResponses = (databaseResponse: Iobject[], elasticResponse: IElasticResponse[]) => {
    const Response: { database?: Iobject, elastic?: IElasticResponse }[] = databaseResponse.map(value => {

        const elasticfind = elasticResponse.find(element => element._source.id === value.uuid)
        if(elasticfind) {
            const index = elasticResponse.indexOf(elasticfind);
            if (index > -1) {
                elasticResponse.splice(index, 1);
              }
        }

        return {
            database: value,
            elastic: elasticfind
        }
    })

    elasticResponse.forEach(value => {
        Response.push({
            elastic: value
        })
    })

    return {
        status: true,
        data: Response
    }
}

const SearchInDatabase = async (options: { userid?: string; object_id?: string}) => {
    try {
        const response = await objectModel.find(MongoQueryBuilder(options))

        if(response) return response
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const SearchInElasticsearch = async (options: { userid?: string; object_id?: string; search?: string}): Promise<IElasticResponse[] | false> => {
    try {

        const response = await SearchClient.search(ElasticQueryBuilder({ uuid: options.object_id, owner: options.userid }))

        return response.body.hits.hits
    }
    catch(err) {
        console.log("SEARCH ERROR:", err)
        return false
    }
}

const ElasticQueryBuilder = (options: { uuid?: string, owner?: string }) => {
    return {
        index: String(process.env.ELASTIC_INDEX),
        body: {
            query: {
                bool: {
                    must: () => {
                        const MatchArray = []
                        if(options.uuid) MatchArray.push({ match: { uuid: options.uuid }})
                        if(options.owner) MatchArray.push({ match: { owner: options.owner }})
                        
                        return MatchArray
                    }
                }
            }
        }
    }
}

const MongoQueryBuilder = (options: { object_id?: string, userid?: string }) => {
    const ResultObject: { uuid?: string; owner?: string} = {}

    if(options.object_id) ResultObject.uuid = options.object_id
    if(options.userid) ResultObject.owner = options.userid

    return ResultObject
}