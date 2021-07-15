const { Schema, model } = require('mongoose')

const TrabajadorSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        //------IMPORTANTE ESTO ES PARA UNIR LA TABLA CON EL USUARIO------//
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    empresa: {
        //------IMPORTANTE ESTO ES PARA UNIR LA TABLA CON EL USUARIO------//
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    }

});

//----- ESTO ES OPCIONAL------//
//----- ES DOGMA DE FE, ESTA QUITANDO EL __V, RETORNANDO EL RESTO   -------//
TrabajadorSchema.method('toJSON', function() {
    //añadimos password para que no se añada
    const { __v, ...object } = this.toObject();
    return object;
})

//Cuidado con este export, es model(...)

module.exports = model('Trabajador', TrabajadorSchema);