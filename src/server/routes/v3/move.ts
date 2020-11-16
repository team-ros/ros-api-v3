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

import { CheckIfParentExists, CheckIfParentExists as CheckIfObjectExists, CheckForDoubleNames } from "../../handlers/v3/create-dir"
import { GetCurrentObjectName, MoveObject } from "../../handlers/v3/move"

router.patch("/", validationRules, async (req: IAuthenticatedRequest, res: Response) => {

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

    const name: string = req.body.name || null
    const parent: string | null = req.body.parent || null
    const uuid: string = req.body.object_id
    const user: string = req.user.sub

    if(!await CheckIfObjectExists(uuid, user)) return res.json(RESPONSE("OBJECT_DOES_NOT_EXIST"))

    if(parent !== null) {
        if(!await CheckIfParentExists(parent, user)) return res.json(RESPONSE("PARENT_DOES_NOT_EXIST"))
    }

    if(name === null) {
        const currentObjectName = await GetCurrentObjectName(uuid, user)
        if(!currentObjectName) return res.json(RESPONSE("OBJECT_NAME_NOT_FETCHABLE"))

        if(!await CheckForDoubleNames(currentObjectName, parent, user)) return res.json(RESPONSE("OBJECT_ALREADY_EXISTS"))
    }
    else {
        if(!await CheckForDoubleNames(name, parent, user)) return res.json(RESPONSE("OBJECT_ALREADY_EXISTS"))
    }

    if(!await MoveObject(uuid, parent, name, user)) return res.json(RESPONSE("OBJECT_NOT_MOVABLE"))

    return res.json({
        status: true
    })
})

export default router