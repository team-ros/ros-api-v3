import * as admin from 'firebase-admin';
import { RESPONSE } from "../Responses/v3/ERROR_RESPONSES"
import { Request, Response, NextFunction } from "express"

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(Buffer.from(String(process.env.FIREBASE), 'base64').toString("utf-8")))
});

interface IRequest extends Request {
    user?: any
}

export const firebaseMiddleware = async (req: IRequest, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) return res.status(403).json(RESPONSE("USER_NOT_AUTHENTICATED"))

    if(!/Bearer .*/.test(req.headers.authorization)) return res.status(403).json(RESPONSE("TOKEN_MALFORMED"))

    const token: string = req.headers.authorization.replace("Bearer ", "")

    try {
        const tokenResponse = await admin.auth().verifyIdToken(token)
        req.user = {
            sub: tokenResponse.uid
        }
        next()
    }
    catch(err) {
        res.status(403).json(RESPONSE("TOKEN_NOT_VALID"))
    }
}

