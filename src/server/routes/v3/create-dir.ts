import express, { Request, Response } from "express"
const router = express.Router()

import { body, validationResult } from "express-validator"

const validationRules = [
    body("name").isString().notEmpty(),
    body("parent").isUUID().optional({ nullable: true })
]

interface IAuthenticatedRequest extends Request {
    user?: any
}

import { CheckIfParentExists, CheckForDoubleNames, CreateDirectory } from "../../handlers/v3/create-dir"

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

    if(parent !== null) {
        if(!await CheckIfParentExists(parent, user)) return res.json({
            status: false,
            message: "parent object does not exist",
        })
    }

    if(!await CheckForDoubleNames(name, parent, user)) return res.json({
        status: false,
        message: "an object with the same name already exists in this directory"
    })

    if(!await CreateDirectory(name, parent, user)) return res.json({
        status: false,
        message: "database error"
    })
    
    return res.json({
        status: true,
        message: "directory successfully created"
    })

})

export default router