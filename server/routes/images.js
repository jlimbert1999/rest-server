const express = require('express')
const fs = require('fs')
let app = express()
const path = require('path')
const { verificarTokenImg } = require('../middlewares/authentication')

app.get('/imagen/:tipo/:img', verificarTokenImg,(req, res) => {
    let tipo = req.params.tipo
    let imagen = req.params.img


    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        let noimgPath = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(noimgPath)
    }

})

module.exports = app