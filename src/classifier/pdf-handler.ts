import fs from "fs"
import pdf from "pdf-parse"

export const PdfHandler = async (path: string) => {
    try {
        const data = fs.readFileSync(path)
        const text = await (await pdf(data)).text
        return text
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}