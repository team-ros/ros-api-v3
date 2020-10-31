import express, { Request, Response } from "express"
const router = express.Router()

import { body, check, validationResult } from "express-validator"

const validationRules = [
    body("object_id").isUUID().notEmpty()
]

interface IAuthenticatedRequest extends Request {
    user?: any
}

import { CheckIfParentExists as CheckIfObjectExists } from "../../handlers/v3/create-dir"
import { CheckType } from "../../handlers/v3/get"
import { RemoveObjectFromDatabase, RemoveObjectFromS3 } from "../../handlers/v3/remove"

router.delete("/", validationRules, async (req: IAuthenticatedRequest, res: Response) => {

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

    const user: string = req.user.sub
    const uuid: string = req.body.object_id

    if(!await CheckIfObjectExists(uuid, user)) return res.json({
        status: false,
        message: "the requested object does not exist"
    })

    if(await CheckType(uuid, user) === "file") {
        if(!await RemoveObjectFromS3(uuid)) return res.json({
            status: false,
            message: "could not remove object from s3"
        })
    }

    if(!await RemoveObjectFromDatabase(uuid, user)) return res.json({
        status: false,
        message: "could not remove object from database"
    })

    return res.json({
        status: true
    })

})

export default router