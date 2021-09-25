const express = require('express')
const Usuario = require('../models/usuario')  //importamos el modelo usuario
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const app = express()

module.exports = app

app.post('/login', (req, res) => {
    let body = req.body; //recuperamos datos del fomulario
    Usuario.findOne({ email: body.email }, (err, userDB) => {   //buscamos un email
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!userDB) {    //user no encontrado
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(usuario) o contrana incorrectos'
                }
            })
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o (contrana) incorrectos'
                }
            })
        }
        let token=jwt.sign({
            usuario:userDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
        res.json({
            ok:true,
            usuario: userDB,
            // token:token,     //en ES6 esto puede omitirse
            token
        })
    })
})