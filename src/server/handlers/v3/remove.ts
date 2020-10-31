import { objectModel } from "../../../database/model"
import minioClient from "../../../s3/connection"
import minioConnection from "../../../s3/connection"

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
        await minioClient.removeObject((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), uuid)
        return true
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}
