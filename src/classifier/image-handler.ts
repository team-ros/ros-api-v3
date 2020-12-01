import axios from "axios"
import fs from "fs"
import FormData from "form-data"

export const ImageHandler = async (filePath: string) => {
    try {

        const data = new FormData()
        data.append("file", fs.createReadStream(filePath))

        const response = await axios({
            url: String(process.env.OBJECT_DETECTION_URL),
            method: "PUT",
            data: data,
            headers: {
                ...data.getHeaders()
            }
        })

        if(response.data.status) {
            return response.data.data
        }
        return false
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}