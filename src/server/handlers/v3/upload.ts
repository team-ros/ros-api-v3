import { objectModel } from "../../../database/model"
import minioClient from "../../../s3/connection"
import { SearchClient } from "../../../elasticsearch/connection"
import { v4 as uuidv4 } from "uuid"

export const UploadFile = async (file: Express.Multer.File, owner: string, name: string | null, parent: string | null, fileID: string) => {
    try {

        const minioResponse = await minioClient.fPutObject((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), fileID, file.path, {
            "Content-Type": file.mimetype
        })
        
        if(!minioResponse) return false

        const databaseResponse = await objectModel.create({
            uuid: fileID,
            name: name || file.originalname,
            parent,
            owner,
            type: true,
            file_size: file.size
        })

        if(databaseResponse) return true
        return false

    }   
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}

export const IndexObject = async (type: boolean, name: string, owner: string, id: string, contents?: string) => {
    try {
        await SearchClient.index({
            index: "ros",
            body: {
                type, // true = file; false = directory
                name,
                owner,
                id,
                contents
            }
        })
        return true
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}