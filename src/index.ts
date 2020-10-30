// this file loads environment variables and checks if they are set correctly

if(!process.env.DATABASE_URL) throw "no database url defined in environment"
if(!process.env.S3_ENDPOINT) throw "no s3 endpoint defined in environment"
if(!process.env.S3_PORT) throw "no s3 port defined in environment"
if(!process.env.S3_ACCESS_KEY) throw "no s3 access key defined in environment"
if(!process.env.S3_SECRET_KEY) throw "no s3 secret key defined in environment"
if(!process.env.FIREBASE) throw "no firebase key defined in environment"

import "./server"