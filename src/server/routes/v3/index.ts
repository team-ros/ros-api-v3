import express from "express"
const router = express.Router()

// import routes
import createDirectory from "./create-dir"
import upload from "../v3/upload"
import get from "../v3/get"

// apply routes
router.use("/create-dir", createDirectory)
router.use("/upload", upload)
router.use("/get", get)

export default router