require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path=require('path')

// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))


//habiliar carpeta publica para acceso
app.use(express.static(path.resolve(__dirname,'../public')))

//Configuracion global de rutas
app.use(require('./routes/index')) //importamos las rutas


mongoose.connect(process.env.urlbase, (err,res)=>{//conecion bd mondo
    if(err){
        throw err;
    }
    console.log("conexion a la bd exitosa")
}); 

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto", 3000)
})