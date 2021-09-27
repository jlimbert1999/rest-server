const express = require('express')
const fileUpload = require('express-fileupload')
const usuario = require('../models/usuario')
const app = express()

const Usuario = require('../models/usuario')
const Producto = require('../models/137 producto')

const fs = require('fs')
const path = require('path')

//defaul options
app.use(fileUpload())

app.post('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "no se a seleccionado ningun archivo"
                }
            })
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "los tipos permitidos son  " + tiposValidos.join(', ')
                }
            })

    }

    let archivo = req.files.archivo
    let nombreArchivo = archivo.name.split('.')   //nombre archivo y extension
    let extension = nombreArchivo[nombreArchivo.length - 1] //tomamos el ultimo parametro que es la extesnion
    // extensiones permiitdas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg']
    if (extensiones.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Las extensiones permitidas son ' + extensiones.join(', '),
            extension
        })
    }


    //cambiar nombre de archivo
    let nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nameFile}`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }
        //aqui imagen ya esta lista
        if(tipo=='usuarios'){
            imagenUsuario(id, res, nameFile);
           
        }
        if(tipo=='productos'){
            imagenProducto(id, res, nameFile)
        }
 
        
        // res.json({

        //     ok: true,
        //     message: "archivo subido"

        // })
    })
})

const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (!usuarioBD) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400)
                .json({
                    ok: false,
                    message: 'usuario no existe'
                });
        }
        // let pathImg=path.resolve(__dirname, `../../uploads/usuarios/${ usuarioBD.img}`);
        // if(fs.existsSync(pathImg)){
        //     fs.unlinkSync(pathImg)  //borramos img
        // }

        borrarArchivo(usuarioBD.img, 'usuarios')

        usuarioBD.img = nombreArchivo
        usuarioBD.save((err, usuarioBD) => {  //guardar en la base de datos
            res.json({
                ok: true,
                usuario: usuarioBD,
                img: nombreArchivo
            })
        })


    })
}


const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (!productoBD) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400)
                .json({
                    ok: false,
                    message: 'producto no existe'
                });
        }
        borrarArchivo(productoBD.img, 'productos')
        productoBD.img= nombreArchivo
        productoBD.save((err, productoBD) => {  //guardar en la base de datos
            res.json({
                ok: true,
                producto: productoBD,
                img: nombreArchivo
            })
        })
    })

}


const borrarArchivo = (nombreImg, tipo) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)  //borramos img
    }
}


module.exports = app;