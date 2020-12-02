import { objectModel } from "../../../database/model"
import minioClient from "../../../s3/connection"
import { SearchClient } from "../../../elasticsearch/connection"

export const RemoveObjectFromDatabase = async (uuid: string, owner: string) => {
    try {
        const response = await objectModel.deleteOne({ uuid, owner })
        if(response) return true
        return false
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}

export const RemoveObjectFromS3 = async (uuid: string) => {
    try {
        await minioClient.removeObject(String(process.env.S3_BUCKET), uuid)
        return true
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

export const deleteObj = async (object_id: string, owner: string) => {    
    try {
        const checkObjectExists = await checkIfObjectExists(object_id, owner)
        if(checkObjectExists === "dir") {
            const children = await checkForChildren(object_id, owner)
            if(children) {
                children[0].descendants.forEach(async (value: any) => {
                    await deleteSingleObject(value.uuid)
                });
                await deleteSingleObject(object_id)
                return true
            }
        }
        if(checkObjectExists === "file") {
            await deleteSingleObject(object_id)
            return true
        }
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const checkIfObjectExists = async (object_id: string, owner: string) => {
    try {
        const result = await objectModel.findOne({ uuid: object_id, owner})
        if (result !== null) {
            if(result.type === true) return "file"
            return "dir"
        }
        else {
            return false
        }
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const deleteSingleObject = async (uuid: string): Promise<void> => {
    try {
        const databaseDelete = await objectModel.deleteOne({ uuid })
        const s3Delete = await minioClient.removeObject(String(process.env.S3_BUCKET), uuid)
        const elasticDelete = await RemoveObjectFromElasticsearch(uuid)
    }
    catch(err) {
        console.log(err)
    }
}

const checkForChildren = async (uuid: string, owner: string) => {
    try {
        const response = await objectModel.aggregate([
            { $match: { uuid }},
            { 
                $graphLookup: {
                    from: 'objects',
                    startWith: "$uuid",
                    connectFromField: "uuid",
                    connectToField: "parent",
                    as: 'descendants'
                }
            },
        ])
        return response
    }
    catch(err) {
        console.log(err)
        return false
    }
}
