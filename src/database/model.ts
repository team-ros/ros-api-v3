import mongoose from "./connection"
import { Schema, Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"


export interface Iobject extends Document {
    uuid?: string
    name: string
    parent: string | null
    mimeType?: string
    type: boolean
    owner: string
    file_size?: number
    created_at?: number
}

const objectSchema = new Schema({

    // object id
    uuid: {
        type: String,
        required: true,
        index: true,
        unique: true,
        default: uuidv4
    },

    // object name
    name: {
        type: String,
        required: true
    },

    // parent object
    parent: {
        type: String,
        index: true
    },

    mimeType: {
        type: String,
        required: false
    },

    // file type
    type: {
        type: Boolean,
        required: true,
        index: true
    },

    // owner id
    owner: {
        type: String,
        required: true,
        index: true
    },

    file_size: {
        type: Number
    },

    // creation date unix timestamp
    created_at: {
        type: Number,
        required: true,
        default: Date.now
    }

})

export const objectModel = mongoose.model<Iobject>("object", objectSchema)