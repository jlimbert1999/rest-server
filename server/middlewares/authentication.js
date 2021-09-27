const jwt=require('jsonwebtoken')

//=========VERIFICAR TOKEN==================
let verificarToken = (req, res, next) => {
    let token=req.get('token');
    jwt.verify(token,process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"el token no es valido"
                }
            })
        }
        req.usuario=decoded.usuario;
        next()
    })
   
}


let verificarAdminRol= (req, res, next) => {
    let usuario=req.usuario
    if(usuario.role==="ADMIN_ROLE"){
        next()
    }
    else{
        res.json({
            of:false,
            err:{
                message:"el user no es admin"
            }
        })

    }
}

//VERIFICA TOKEN IMG
let verificarTokenImg=(req,res,next)=>{
    let token=req.query.token

    jwt.verify(token,process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"el token no es valido"
                }
            })
        }
        req.usuario=decoded.usuario;
        next()
    })

}
module.exports={
    verificarToken,
    verificarAdminRol,
    verificarTokenImg
}
    