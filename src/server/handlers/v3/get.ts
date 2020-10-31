import { objectModel } from "../../../database/model"
import minioClient from "../../../s3/connection"

export const FileListing = async (parent: string | null, owner: string) => {
    try {
        const response = await objectModel.find({ parent, owner })

        if(!response) return false

        return response.map(value => {
            return {
                id: value.uuid,
                name: value.name,
                parent: value.parent,
                type: value.type ? "file" : "directory",
                size: value.type ? value.file_size : 0,
                date: value.created_at
            }
        })
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}


export const CheckType = async (uuid: string | null, owner: string) => {

    if(uuid === null) return "directory"

    try {
        const response = await objectModel.findOne({ uuid, owner })
        if(response) return response.type ? "file" : "directory"
        return false
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}

export const GetFile = async (uuid: string) => {
    try {
        const response = await minioClient.presignedGetObject((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), uuid, 24*60*60)
        return response
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}
