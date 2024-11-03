const fs = require("fs")

/**@param {string} dir  */
function handleFilesInDir(dir){
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
        if (file.endsWith(".js")){
            const text = fs.readFileSync(dir+file).toString()
            const splitted = text.split("\n")
            const newSplitted = []

            //remove all imports and exports
            splitted.forEach((row) => {
                if (row.startsWith("import ")) return
                else if (row.startsWith("export ")){
                    newSplitted.push(row.substring(7))
                }else newSplitted.push(row)
            })

            fs.writeFileSync(dir+file,newSplitted.join("\n"))

        }else{
            //recursive dir handling
            handleFilesInDir(dir+file+"/")
        }
    })
}

handleFilesInDir("./public/js/")