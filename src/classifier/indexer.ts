import { PlaintextHandler } from "./plaintext-handler"
import { PdfHandler } from "./pdf-handler"
import { DocxHandler } from "./docx-handler"
import { ImageHandler } from "./image-handler"

const maxIndexingSize: number = 1e+7 // 10 Megabyte

export const GetContent = async (file: Express.Multer.File) => {
    try {
        if(file.size > maxIndexingSize) return false
        
        if(file.mimetype === "text/plain" || file.mimetype === "application/javascript" || file.mimetype === "text/css" || file.mimetype === "text/html") {
            const response = await PlaintextHandler(file.path)
            if(!response) return false
            return response
        }
        
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
            const response = await ImageHandler(file.path)
            if(!response) return false
            return response
        }

        if(file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const response = await DocxHandler(file.path)
            if(!response) return false
            return response
        }

        if(file.mimetype === "application/pdf") {
            const response = await PdfHandler(file.path)
            if(!response) return false
            return response
        }

        return false

    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}