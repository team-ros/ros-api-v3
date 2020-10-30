import { objectModel } from "../../../database/model"

export const CheckIfParentExists = async (uuid: string, owner: string) => {
    try {
        const response = await objectModel.findOne({ uuid, owner })
        if(response) return true
        return false
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}

export const CheckForDoubleNames = async (name: string, parent: string | null, owner: string) => {
    try {
        const response = await objectModel.findOne({
            name, 
            parent,
            owner
        })
        if(response) return false
        return true
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}

export const CreateDirectory = async (name: string, parent: string | null, owner: string) => {
    try {
        const response = await objectModel.create({
            name,
            parent,
            owner,
            type: false
        })

        if(response) return true
        return false
    }
    catch(err) {
        if(Boolean(process.env.DEV)) console.error(err)
        return false
    }
}