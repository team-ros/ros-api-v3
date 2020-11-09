import express, { Request, Response } from "express"
const router = express.Router()

import { RESPONSE } from "../../Responses/v3/ERROR_RESPONSES"
import { body, validationResult } from "express-validator"

const validationRules = [
    body("parent").isUUID().optional({ nullable: true }),
    body("name").isString().optional({ nullable: true }),
    body("object_id").isUUID(),
]

interface IAuthenticatedRequest extends Request {
    user?: any
}

import { CheckIfParentExists as CheckIfObjectExists, CheckIfParentExists, CheckForDoubleNames  } from "../../handlers/v3/create-dir"
import { GetCurrentObjectName } from "../../handlers/v3/move"
import { Copy, GetOriginalName } from "../../handlers/v3/copy"

router.copy("/", validationRules, async (req: IAuthenticatedRequest, res: Response) => {

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

    const parent: string | null = req.body.parent || null
    const name: string | null = req.body.name || null
    const object_id: string = req.body.object_id
    const owner: string = req.user.sub

    if(!await CheckIfObjectExists(object_id, owner)) return res.json(RESPONSE("OBJECT_DOES_NOT_EXIST"))

    if(parent !== null) {
        if(!await CheckIfParentExists(object_id, owner)) return res.json(RESPONSE("PARENT_DOES_NOT_EXIST"))
    }

    if(name === null) {
        const currentObjectName = await GetCurrentObjectName(object_id, owner)
        if(!currentObjectName) return res.json(RESPONSE("OBJECT_NAME_NOT_FETCHABLE"))

        if(!await CheckForDoubleNames(currentObjectName, parent, owner)) return res.json(RESPONSE("OBJECT_ALREADY_EXISTS"))
    }
    else {
        if(!await CheckForDoubleNames(name, parent, owner)) return res.json(RESPONSE("OBJECT_ALREADY_EXISTS"))
    }

    const OriginalName = await GetOriginalName(object_id)

    if(OriginalName) {
        try {
            const respone = await Copy(parent, object_id, owner, name || OriginalName)
            if(respone) return res.json({ status: true })
            return res.json(RESPONSE("COPY_ERROR"))
        }
        catch(err) {
            if(Boolean(process.env.DEV)) console.error(err)
            return res.json(RESPONSE("COPY_ERROR"))
        }
    }

    return res.json(RESPONSE("DATABASE_ERROR"))

})

export default router