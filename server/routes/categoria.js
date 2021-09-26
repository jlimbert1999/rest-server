const express = require('express')

let app = express()

let Categoria = require('../models/categoria')

const { verificarToken, verificarAdminRol } = require('./../middlewares/authentication');

//MOSTRAR CATEGORIAS
app.get('/categoria', (req, res) => {
    Categoria.find()
        .sort('descripcion')                        //funcion de ordenamiento, opcional
        .populate('usuario', 'nombre email')        //recuperar valores de otra tabla con el id
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        })

})

//MOSTRAR CATEGORIA CON ID
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            res.json({
                ok: true,
                msg: "la caetogoria con ese id no existe"
            });
        }
        else {

        }res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

})

//CREAR NUEVA CATEGORIA
app.post('/categoria', [verificarToken, verificarAdminRol], (req, res) => {
    let newCategoria = req.body
    let categoria = new Categoria({
        descripcion: newCategoria.descripcion,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
})

// //
app.put('/categoria/:id', [verificarToken, verificarAdminRol], (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Categoria.findByIdAndUpdate(id, nuevosDatos, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
            msg: "caterogira actualizada"
        })
    })

})
let cambiastado = {
    status: false
}
// //delete
app.delete('/categoria/:id', [verificarToken, verificarAdminRol], (req, res) => {
    let id = req.params.id
    Categoria.findByIdAndUpdate(id, cambiastado, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id de  la categiria no existe'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
            msg: "caterogira eliminada"
        })
    })
    //solo admin puede borrar
    //tiene que pedir token

})

module.exports = app;