const express = require('express')
const app = express()
const Usuario = require('../models/usuario')  //importamos el modelo usuario
const bcrypt = require('bcrypt');
const _ = require('underscore');  //_ estandadr de undercore
const usuario = require('../models/usuario');


app.get('/', function (req, res) {
    res.json('Hello World')
})
app.get('/usuario', function (req, res) {
    let desde = req.query.desde || 0    //para obtner paramtro ingresaso desde postman {{url}}/usuario?desde=1
    desde = Number(desde)//numero

    let limite = req.query.limite || 5 //postman parametro llamado limite {{url}}/usuario?limite=1&desde=8
    limite = Number(limite)

    Usuario.find({status:true}, 'nombre email role status google img')//obtener todos los users
                    //nombres de los valores que se obtentran
                    
        .skip(desde)    //salta los 1ros 5 registros
        .limit(limite)   //cantidad de registros que traera
        .exec((err, usuarios) => {//execute
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({status:true}, (err, conteo) => {//nuemro de registros ({}) =todos los user
                res.json({
                    ok: true,
                    usuarios,
                    cuantos:conteo
                })
            })
            

        })
})

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre, //valores del modelo se cargan 
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    usuario.save((err, usuarioDB) => {    //guardar en la BD, usuarioDb es el usuario que se agrego con exito
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // usuarioDB.password=null;    //para que no muetsre pass en la respuesta

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

    // if (body.nombre == undefined) {
    //     res.status(400).json({
    //         ok:false,
    //         message:'el nombre es necesario'
    //     })
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }
})
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'status']);  //obtner solo los valore permitidos con pick del underscore

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
    // res.json({
    //     id
    // })
})
app.delete('/usuario/:id', function (req, res) {
    // res.json('delete usuario')
    let id=req.params.id
    // Usuario.findByIdAndRemove(id, (err, usuarioDelete)=>{
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }
    //     if(!usuarioDelete){
    //         return res.status(400).json({
    //             ok: false,
    //             err:{
    //                 message:"Usuario no encontrado"
    //             }
    //         })
    //     }
    //     res.json({
    //         ok:true,
    //         usuario:usuarioDelete
    //     })
    // })

    // otro tipo de eliminacion, marcar status = false
    let cambiastado={
        status:false
    }
    Usuario.findByIdAndUpdate(id, cambiastado,{new:true},(err, usuarioDelete)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario:usuarioDelete
        })
        
    })

})

module.exports = app