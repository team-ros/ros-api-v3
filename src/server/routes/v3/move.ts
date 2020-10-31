import express, { Request, Response } from "express"
const router = express.Router()

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

    if(!await CheckIfObjectExists(uuid, user)) return res.json({
        status: false,
        message: "the requested object does not exist"
    })

    if(parent !== null) {
        if(!await CheckIfParentExists(parent, user)) return res.json({
            status: false,
            message: "parent object does not exist"
        })
    }

    if(name === null) {
        const currentObjectName = await GetCurrentObjectName(uuid, user)
        if(!currentObjectName) return res.json({
            status: false,
            message: "could not get name of object"
        })

        if(!await CheckForDoubleNames(currentObjectName, parent, user)) return res.json({
            status: false,
            message: "an object with the same name already exists in this directory"
        })
    }
    else {
        if(!await CheckForDoubleNames(name, parent, user)) return res.json({
            status: false,
            message: "an object with the same name already exists in this directory"
        })
    }

    if(!await MoveObject(uuid, parent, name, user)) return res.json({
        status: false,
        message: "could not move object"
    })

    return res.json({
        status: true
    })
})

export default router