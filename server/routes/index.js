const express = require('express')
const app = express()


app.use(require('./usuario')) //importamos las rutas
app.use(require('./login')) //importamos las rutas login

module.exports=app