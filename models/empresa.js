const { Schema, model } = require('mongoose')

const EmpresaSchema = Schema({

        nombre: {
            type: String,
            required: true
        },
        img: {
            type: String,
        },
        usuario: {
            //------IMPORTANTE ESTO ES PARA UNIR LA TABLA CON EL USUARIO------//
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }

    }, //PARA CAMBIAR EL NOMBRE DE LA COLECCION EN LA BBDD
    // {collection:'hospitales'}  

);

//----- ESTO ES OPCIONAL------//
//----- ES DOGMA DE FE, ESTA QUITANDO EL __V,    -------//
EmpresaSchema.method('toJSON', function() {

    const { __v, ...object } = this.toObject();


    return object;
})

//Cuidado con este export, es model(...)

module.exports = model('Empresa', EmpresaSchema);