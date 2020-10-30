import { objectModel } from "../../../database/model"
import minioClient from "../../../s3/connection"
import { v4 as uuidv4 } from "uuid"

export const UploadFile = async (file: Express.Multer.File, owner: string, name: string | null, parent: string | null) => {
    try {
        const fileID = uuidv4()

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