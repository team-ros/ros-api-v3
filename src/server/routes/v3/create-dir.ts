import express, { Request, Response } from "express"
const router = express.Router()

import { body, validationResult } from "express-validator"
import { RESPONSE } from "../../Responses/v3/ERROR_RESPONSES"
import { v4 as uuidv4 } from "uuid"

const validationRules = [
    body("name").isString().notEmpty(),
    body("parent").isUUID().optional({ nullable: true })
]

interface IAuthenticatedRequest extends Request {
    user?: any
}

import { CheckIfParentExists, CheckForDoubleNames, CreateDirectory } from "../../handlers/v3/create-dir"
import { IndexObject } from "../../handlers/v3/upload"

router.post("/", validationRules, async (req: IAuthenticatedRequest, res: Response) => {

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

    const name: string = req.body.name
    const parent: string | null = req.body.parent || null
    const user: string = req.user.sub
    const uuid: string = uuidv4()

    if(parent !== null) {
        if(!await CheckIfParentExists(parent, user)) return res.json(RESPONSE("PARENT_DOES_NOT_EXIST"))
    }

    if(!await CheckForDoubleNames(name, parent, user)) return res.json(RESPONSE("OBJECT_ALREADY_EXISTS"))

    if(!await CreateDirectory(name, parent, user, uuid)) return res.json(RESPONSE("DATABASE_ERROR"))

    if(!await IndexObject(false, name, user, uuid)) return res.json(RESPONSE("DIR_CREATED_NOT_INDEXED", { status: true }))
    
    return res.json(RESPONSE("DIR_INDEXED_SUCCESSFULLY", { status: true }))

})

export default router