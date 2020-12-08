import express, { Request, Response } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"
import { SearchOnDatabase, SearchOnElasticsearch } from "../../handlers/admin/GetObjects"

const validationRules = [
    query("limit").isNumeric().optional({ nullable: true }),
    query("offset").isNumeric().optional({ nullable: true }),
    query("userid").isString().optional({ nullable: true }),
    query("search").isString().optional({ nullable: true }),
    query("object_id").isUUID().optional({ nullable: true })
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
        const limit: number | undefined = Number(req.query.limit) || undefined
        const offset: number | undefined = Number(req.query.offset) || undefined
        const userid: string | undefined = String(req.query.userid) || undefined
        const search: string | undefined = String(req.query.search) || undefined
        const object_id: string | undefined = String(req.query.object_id) || undefined

        const Query = { limit, offset, userid,  /* search, object_id */ }

        console.log("QUERY_PARAMS:", Query)

        const DatabaseResponse = await SearchOnDatabase(Query)
        const ElasticRespose = await SearchOnElasticsearch(Query)

    }
    catch(err) {
        
    }

})

export default router