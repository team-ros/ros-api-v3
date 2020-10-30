import { Client } from "minio"

const minioClient = new Client({
    endPoint: String(process.env.S3_ENDPOINT),
    port: process.env.HEROKU_DEV ? undefined : Number(process.env.S3_PORT),
    useSSL: process.env.HEROKU_DEV ? undefined : Boolean(process.env.S3_USE_SSL) || false,
    accessKey: String(process.env.S3_ACCESS_KEY),
    secretKey: String(process.env.S3_SECRET_KEY)
});

export default minioClient