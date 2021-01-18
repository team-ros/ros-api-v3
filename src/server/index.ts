// initialize express instance
import express from "express"
const app = express()

// import middleware
import cors from "cors"
import bodyParser from "body-parser"

// apply middleware
app.use(cors())
app.use(bodyParser.json())

// import routes
import v3 from "./routes/v3"

// apply routes
app.use("/v3", v3)

app.get("/health", (req, res) => {
    res.status(200).send()
})

// set http port
app.listen(process.env.PORT || 8080)