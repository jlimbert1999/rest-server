const mongoose = require('mongoose');
let Schema=mongoose.Schema;
const uniqueValidato=require('mongoose-unique-validator');
let rolesValidos={
    values:['ADMIN_ROLE', 'USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}

let usuarioSchema=new Schema({
    nombre:{
        type:String,
        required:[true, 'el nombre es necesario'] //corchetes para el mensaje
    },
    email:{
        type:String,
        unique:true, //validacion para que sea unico
        required:[true, 'el correo es necesario']
       
    },
    password:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:[false, 'la imagen no es requerida']

    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos

    },
    status:{
        type:Boolean,
        default:true

    },
    google:{
        type:Boolean,
        default:false
    }

    
});
usuarioSchema.methods.toJSON=function() {   //para no mostrar parametro password
    let user=this;
    let userobject=user.toObject();
    delete userobject.password
    return userobject;
}

usuarioSchema.plugin(uniqueValidato, {message:'{PATH} debe de ser unico'})

module.exports=mongoose.model("Usuario", usuarioSchema) //exportar el modelo con el nombre Usuario
