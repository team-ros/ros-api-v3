import express, { Request, Response } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"

import multer from "multer"
const upload = multer({ dest: "/tmp" })

const validationRules = [
    query("name").isString().optional({ nullable: true }),
    query("parent").isUUID().optional({ nullable: true })
]

interface IAuthenticatedRequest extends Request {
    user?: any
}

import { CheckForDoubleNames } from "../../handlers/v3/create-dir"
import { UploadFile } from "../../handlers/v3/upload"

router.get("/", validationRules, upload.single("file"), async (req: IAuthenticatedRequest, res: Response) => {

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

    const file = req.file
    const parent: any = req.query.parent || null
    const owner: string = req.user.sub
    const name: any = req.query.name || null

    if(!file) return res.json({
        status: false,
        message: "no file uploaded"
    })

    if(!await CheckForDoubleNames(name || file.originalname, parent, owner)) return res.json({
        status: false,
        message: "An object with the same name already exists in this directory"
    })

    if(!await UploadFile(file, owner, name, parent)) return res.json({
        status: false,
        message: "could not upload file"
    })

    return res.json({
        status: true,
        message: "file uploaded successfully"
    })


})

export default router