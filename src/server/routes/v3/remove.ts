import express, { Request, Response } from "express"
const router = express.Router()

import { RESPONSE } from "../../Responses/v3/ERROR_RESPONSES"
import { body, validationResult } from "express-validator"

const validationRules = [
    body("object_id").isUUID().notEmpty()
]

interface IAuthenticatedRequest extends Request {
    user?: any
}

import { CheckIfParentExists as CheckIfObjectExists } from "../../handlers/v3/create-dir"
import { deleteObj as DeleteObject } from "../../handlers/v3/remove"

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

    if(!await CheckIfObjectExists(uuid, user)) return res.json(RESPONSE("OBJECT_DOES_NOT_EXIST"))

    if(!await DeleteObject(uuid, user)) return res.json(RESPONSE("DELETE_ERROR"))

    return res.json({
        status: true
    })

})

export default router