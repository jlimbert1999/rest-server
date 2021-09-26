const express = require('express');
const { verificarToken } = require('../middlewares/authentication')

const app = express()
let Producto = require('../models/137 producto')


//obtner todos los productos
app.get('/productos', (req, res) => {
    //trae productos
    //popultate usuario, categoria
    //paginado
    Producto.find({ disponible: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

//obtner un prodcuto id
app.get('/productos/:id', (req, res) => {
    let id = req.params.id
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            res.json({
                ok: true,
                msg: "el producto con ese id no existe"
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
    //popultate usuario, categoria
    //paginado
})

//crear producto
app.post('/productos', verificarToken, (req, res) => {
    let nuevoProducto = req.body
    let producto = new Producto({
        nombre: nuevoProducto.nombre,
        precioUni: nuevoProducto.precioUni,
        descripcion: nuevoProducto.descripcion,
        categoria: nuevoProducto.categoria,
        usuario: req.usuario._id
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto creado'
        })
    })

    //grabar usario, grabar categoria
    //popultate usuario, categoria
    //paginado
})

//cactualizar producto
app.put('/productos/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Producto.findByIdAndUpdate(id, nuevosDatos, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            res.json({
                ok: false,
                err: {
                    message: "no existe ese id de producto"
                }

            })
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: "producto actualizado"
        })
    })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
    //grabar usario, grabar categoria
    //popultate usuario, categoria
})

//borrar producto
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id
    let cambioEstado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambioEstado, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: "producto eliminado"
        })
    })
    //cambiar estado a false

})

app.get('/productos/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let expresionR=new RegExp(termino, 'i') //expresion regular
    Producto.find({ nombre: expresionR })
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                oK: true,
                productos: producto
            })
        })
})

module.exports = app