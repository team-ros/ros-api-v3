// initialize express instance
import express from "express"
const app = express()

// import middleware
import cors from "cors"
import bodyParser from "body-parser"
import { firebaseMiddleware } from "./middleware/firebaseMiddleware"

// apply middleware
app.use(cors())
app.use(bodyParser.json())
app.use(firebaseMiddleware)

// import routes
import v3 from "./routes/v3"

// apply routes
app.use("/v3", v3)


// set http port
app.listen(process.env.PORT || 8080)