import express, { Request, Response } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"
import { SearchOnDatabase, SearchOnElasticsearch } from "../../handlers/admin/GetObjects"

const validationRules = [
    query("limit").isNumeric().optional({ nullable: true }),
    query("offset").isNumeric().optional({ nullable: true }),
    query("userid").isString().optional({ nullable: true }),
    query("search").isString().optional({ nullable: true }),
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
        const limit: any = req.query.limit
        const offset: any =req.query.offset
        const userid: any = req.query.userid
        const search: any = req.query.search
        const object_id: any = req.query.object_id

        const Query = { limit, offset, userid, search, object_id  }

        const DatabaseResponse = await SearchOnDatabase(Query)
        const ElasticRespose = await SearchOnElasticsearch(Query)

        return res.json({
            status: true,
            database: DatabaseResponse,
            elastic: ElasticRespose.map((value: any) => {
                return {
                    ...value._source
                }
            })
        })

    }
    catch(err) {
        
    }

})

export default router