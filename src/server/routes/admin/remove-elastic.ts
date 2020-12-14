import express, { Request, Response } from "express"
const router = express.Router()

import { body, validationResult } from "express-validator"
import { CheckIfExistsElasticsearch } from "../../handlers/admin/CheckIfExists"
import { RemoveObjectFromElasticsearch } from "../../handlers/admin/RemoveObject"

const validationRules = [
    body("object_id").isUUID().optional({ nullable: false })
]

router.delete("/", validationRules, async (req: Request, res: Response) => {

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

    try {
        const object_id: string = req.body.object_id


        if(!await CheckIfExistsElasticsearch(object_id)) return res.json({ status: false, message: "object does not exist" })

        if(!await RemoveObjectFromElasticsearch(object_id)) return res.json({ status: false, message: "could not get removed"})

        return res.json({ status: true })
    }
    catch(err) {
        return res.json({ status: false })
    }

})

export default router