import express from "express"
import { app } from "firebase-admin"
const router = express.Router()

// import middleware
import { adminMiddleware } from "../../middleware/adminMiddleware"

// apply middleware
router.use(adminMiddleware)

// import routes
import getObjects from "./get-objects"

// apply routes
router.use("/get-objects", getObjects)

export default router