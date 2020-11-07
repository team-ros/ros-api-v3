import express, { Request, Response } from "express"
const router = express.Router()

import { RESPONSE } from "../../Responses/v3/ERROR_RESPONSES"
import { query, validationResult } from "express-validator"

const validationRules = [
    query("object_id").isUUID().optional({ nullable: true}),
]

interface IAuthenticatedRequest extends Request {
    user?: any
}

import { CheckIfParentExists as CheckIfObjectExists } from "../../handlers/v3/create-dir"
import { CheckType, FileListing, GetFile } from "../../handlers/v3/get"

router.get("/", validationRules, async (req: IAuthenticatedRequest, res: Response) => {

    // return any errors from validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return (
            res.status(400)
                .json({
                    status: false, errors: errors.array()
                })
        )
    }

    const object_id: any = req.query.object_id || null
    const user: string = req.user.sub

    if(object_id !== null) {
        if(!await CheckIfObjectExists(object_id, user)) return res.json(RESPONSE("OBJECT_DOES_NOT_EXIST"))
    }

    const ObjectType = await CheckType(object_id, user)

    if(!ObjectType) return res.json(RESPONSE("OBJECT_TYPE_NOT_ENUMERABLE"))

    if(ObjectType === "directory") {
        const fileListing = await FileListing(object_id, user)

        if(fileListing === false) return res.json(RESPONSE("DIR_DATA_NOT_FETCHABLE"))

        return res.json({
            status: true,
            listing: fileListing
        })
    }

    if(ObjectType === "file" && object_id !== null) {
        const fileURL = await GetFile(object_id)

        if(!fileURL) return res.json(RESPONSE("FILE_URL_NOT_FETCHABLE"))

        return res.json({
            status: true,
            url: fileURL
        })
    }

    return res.json(RESPONSE("INTERNAL_SERVER_ERROR"))

})

export default router