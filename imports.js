const fs = require("fs")
const files = fs.readdirSync("./public/js/")
files.forEach((file) => {
    let text = fs.readFileSync("./public/js/"+file).toString()

    text = text.replace('import { _JRCCreateElement } from "./JRCCompiler";\n',"")
    text = text.replace('export const _JRCCreateElement = ',"const _JRCCreateElement = ")

    fs.writeFileSync("./public/js/"+file,text)
})