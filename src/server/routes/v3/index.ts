import express from "express"
const router = express.Router()

// import routes
import createDirectory from "./create-dir"
import upload from "../v3/upload"
import get from "../v3/get"
import move from "../v3/move"
import remove from "../v3/remove"
import search from "../v3/search"
import copy from "../v3/copy"

// apply routes
router.use("/create-dir", createDirectory)
router.use("/upload", upload)
router.use("/get", get)
router.use("/move", move)
router.use("/remove", remove)
router.use("/search", search)
router.use("/copy", copy)

export default router