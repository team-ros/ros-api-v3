import { Request, Response, NextFunction } from "express"

const secret = String(process.env.ADMIN_SECRET)

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.adminsecret !== secret) res.json({ status: false })

    next()
}