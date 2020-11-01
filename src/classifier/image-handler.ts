const cocoSsd = require("@tensorflow-models/coco-ssd")
const tf = require("@tensorflow/tfjs-node")
const translatte = require("translatte")
import fs from "fs"

export const ImageHandler = (path: string): Promise<string | boolean> => {
    return new Promise(response => {
        Promise.all([cocoSsd.load(), fs.readFileSync(path)])
        .then(results => {
            const model = results[0]
            const imgTensor = tf.node.decodeImage(new Uint8Array(results[1]), 3)
            return model.detect(imgTensor)
        })
        .then(predictions => {
            let results = predictions
            let resultValues = []
            for (let value of results) {
                resultValues.push(value.class)
            }
            let count: any = {};
            resultValues.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
            let countString = ""
            for (let i in count) {
                countString += count[i] + " " + i + " "
            }
            translatte(countString, { to: "de" })
            .then((transletedString: any) => { 
                response(transletedString.text)
            })
            .catch((err: any) => {
                if(Boolean(process.env.DEV)) console.error(err)
                response(false)
            })
        })
        .catch((err: any) => {
            if(Boolean(process.env.DEV)) console.error(err)
            response(false)
        })
    })
}