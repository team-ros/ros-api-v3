import { objectModel } from "../../../database/model"

export const GetCurrentObjectName = async (uuid: string, owner: string) => {
    try {
        const response = await objectModel.findOne({ uuid, owner })
        if(!response?.name) return false
        return response.name
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}

export const MoveObject = async (object_id: string, parent: string | null, name: string | null, owner: string) => {
    try {
        const response = await objectModel.updateOne({ uuid: object_id, owner }, {
            parent,
            name: name ? name : undefined
        })
        if(response) return true
        return false
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}