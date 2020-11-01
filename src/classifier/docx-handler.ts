const mammoth = require("mammoth")

export const DocxHandler = async (path: string) => {
    try {
        const text: string = await mammoth.extractRawText({ path })
        return text
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}