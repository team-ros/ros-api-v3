import express from "express"
const router = express.Router()

// import routes
import createDirectory from "./create-dir"
import upload from "../v3/upload"

// apply routes
router.use("/create-dir", createDirectory)
router.use("/upload", upload)

export default router