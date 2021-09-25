//process: es un objeto global
process.env.PORT = process.env.PORT || 3000


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//vencimiento del token
//60 seg * 60 min * 25hr * 20 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//SEMILLA DE AUNTENTIFICACION
process.env.SEED = process.env.SEED || 'este-es-el-seed-produccion';


//base de datos
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe'
} else {
    urlBD = 'mongodb+srv://root:1234jose@cluster0.rwkz9.mongodb.net/cafe?retryWrites=true&w=majority'
}
process.env.urlbase = urlBD


//GOGLE CLIETNE
process.env.CLIENT_ID = process.env.CLIENT_ID || '566411830384-fiffqvlue20s75pkhmnislt3or6sagt0.apps.googleusercontent.com'