const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'descripcion es necesario'] //corchetes para el mensaje
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:'Usuario'      
    },
    status:{
        type:Boolean,
        default:true
    }


});


module.exports = mongoose.model("Categoria", categoriaSchema) //exportar el modelo con el nombre Usuario