//returing root path

const path = require('path')

const rootDir = path.dirname(require.main.filename) // gets the main file directory (app.js root file)

module.exports = rootDir //return the root dir