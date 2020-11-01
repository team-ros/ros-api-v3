import fs from "fs"

export const PlaintextHandler = async (path: string) => {
    try {
        const content = fs.readFileSync(path).toString("utf8")
        return content
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}