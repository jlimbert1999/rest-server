const express = require('express')
const app = express()


app.use(require('./usuario')) //importamos las rutas
app.use(require('./login')) //importamos las rutas login
app.use(require('./categoria'))
app.use(require('./producto'))
app.use(require('./upload'))
app.use(require('./images'))
module.exports=app