import express, { Request, Response } from "express"
const router = express.Router()

import { RESPONSE } from "../../Responses/v3/ERROR_RESPONSES"
import { query, validationResult } from "express-validator"
import { v4 as uuidv4 } from "uuid"

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
import { UploadFile, IndexObject } from "../../handlers/v3/upload"
import { GetContent } from "../../../classifier/indexer"

router.put("/", validationRules, upload.single("file"), async (req: IAuthenticatedRequest, res: Response) => {

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
    const fileID: string = uuidv4()

    if(!file) return res.json(RESPONSE("NO_FILE_UPLOADED"))

    if(!await CheckForDoubleNames(name || file.originalname, parent, owner)) return res.json(RESPONSE("OBJECT_ALREADY_EXISTS"))

    if(!await UploadFile(file, owner, name, parent, fileID)) return res.json(RESPONSE("UPLOAD_ERROR"))

    const fileContents = await GetContent(file)
    
    if(!await IndexObject(true, name || file.originalname, owner, fileID, typeof fileContents === "boolean" ? undefined : fileContents)) return res.json(RESPONSE("FILE_UPLOADED_SUCCESSFULLY_INDEX_ERROR", { status: true }))

    return res.json(RESPONSE("FILE_UPLOADED_SUCCESSFULLY", { status: true }))

})

export default router