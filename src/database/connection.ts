import mongoose from "mongoose"

mongoose.connect(String(process.env.DATABASE_URL), {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

export default mongoose