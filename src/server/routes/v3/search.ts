import express, { Request, Response } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"

const validationRules = [
    query("search").isString().escape()
]

interface IAuthenticatedRequest extends Request {
    user?: any
}

import { SearchObject } from "../../handlers/v3/search"

router.get("/", validationRules, async (req: IAuthenticatedRequest, res: Response) => {

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

    const query: any = req.query.search || null
    const user: string = req.user.sub

    const response = await SearchObject(query, user)
    
    if(response === false) return res.json({
        status: false,
        message: "could not search"
    })

    return res.json({
        status: true,
        search: response
    })
})

export default router