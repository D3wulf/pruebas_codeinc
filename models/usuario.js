const { Schema, model } = require('mongoose')

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true


    },
    email: {

        type: String,
        required: true,
        unique: true



    },
    password: {
        type: String,
        required: true,
    },
    img: {

        type: String,
    },
    role: {

        type: String,
        required: false,
        default: 'USER_ROLE'


    },
    google: {

        type: Boolean,
        default: false


    },


});

//----- ESTO ES OPCIONAL, ES PORQUE MONGO PONE EL _id PARA LAS ID Y EL PROFE LO PREFIERE COMO UID------//
//----- ES DOGMA DE FE, ESTA QUITANDO EL __V, CAMBIANDO EL _ID Y RETORNANDO EL RESTO   -------//
UsuarioSchema.method('toJSON', function() {
    //añadimos password para que no se añada
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

//Cuidado con este export, es model(...)

module.exports = model('Usuario', UsuarioSchema);