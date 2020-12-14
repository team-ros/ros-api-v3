import express from "express"
const router = express.Router()

// import middleware
import { adminMiddleware } from "../../middleware/adminMiddleware"

// apply middleware
router.use(adminMiddleware)

// import routes
import getObjects from "./get-objects"
import removeDatabase from "./remove-db"
import removeElastic from "./remove-elastic"

// apply routes
router.use("/get-objects", getObjects)
router.use("/remove-db", removeDatabase)
router.use("/remove-elastic", removeElastic)

export default router