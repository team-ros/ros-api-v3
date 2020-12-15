import express, { Request, Response } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"
import { Search } from "../../handlers/admin/GetObjects"

const validationRules = [
    query("userid").isString().optional({ nullable: true }),
    query("object_id").isUUID().optional({ nullable: false })
]

router.get("/", validationRules, async (req: Request, res: Response) => {

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
        const userid: any = req.query.userid
        const object_id: any = req.query.object_id

        const SearchResponse = await Search({ userid, object_id })

        return res.json(SearchResponse)

    }
    catch(err) {
        return res.json({
            status: false,
            message: "internal server error",
            debug: err
        })
    }

})

export default router