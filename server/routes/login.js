const express = require('express')
const Usuario = require('../models/usuario')  //importamos el modelo usuario
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express()

const { OAuth2Client } = require('google-auth-library');
const usuario = require('../models/usuario');
const client = new OAuth2Client(process.env.CLIENT_ID);



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
        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: userDB,
            // token:token,     //en ES6 esto puede omitirse
            token
        })
    })
})


//CONFIGURACION DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.post('/google', async (req, res) => {
    let token = req.body.idtoken  //recupera idtoken de goole
    let googleUser = await verify(token)
        .catch(e=>{
            return res.status(403).json({
                ok:false,
                err:e
            })
        })

    Usuario.findOne({email:googleUser.email}, (err, userDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(userDB){
            if(userDB.google==false){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message:"debe de usar autenticacion normal"
                    }
                })
            }
            else{
                let token=jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok:true,
                    usuario:userDB,
                    token
                })
            }
        }
        else{
            //si usuario no existe en la base de datos
            let usuario=new Usuario();
            usuario.nombre=googleUser.nombre
            usuario.email=googleUser.email
            usuario.img=googleUser.img
            usuario.google=true
            usuario.password=':)'   //para pasar las validaciones 

            usuario.save((err,userDB)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token=jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok:true,
                    usuario:userDB,
                    token
                })
            })
        }
    })
})


module.exports = app