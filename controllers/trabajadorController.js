const { response } = require('express');

const Trabajador = require('../models/trabajador');

const getTrabajador = async(req, res = response) => {


    //select y el populate es para coger datos de otros modelos
    const trabajador = await Trabajador.find()
        .populate('usuario', 'nombre email')
        .populate('empresa', 'nombre')

    res.json({
        ok: true,
        trabajador
    })
}

const crearTrabajador = async(req, res = response) => {

    //AQui sabemos quien hizo la request
    const uid = req.uid;
    const { empresa } = req.body;

    //Desestructuramos el req body, esto va debajo del uid para la asignacion al usuario
    // ya que vamos a asignar al modelo en la parte del usuario, la uid
    const trabajador = new Trabajador({
        usuario: uid,
        empresa,
        ...req.body
    });




    try {

        const trabajadorDB = await trabajador.save();

        res.json({
            ok: true,
            msg: 'Todo correcto al crear el trabajador',
            trabajador: trabajadorDB
        })


    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: 'Error al crear el trabajador'
        })

    }




}

const updateTrabajador = async(req, res = response) => {


    //Sacamos la id de la url
    const id = req.params.id;
    //cogemos la uid del que hizo la peticion para mostrarlo
    const uid = req.uid;

    console.log(id);
    console.log(uid);
    try {

        const trabajadorDB = await Trabajador.findById(id);

        if (!trabajadorDB) {

            return res.status(404).json({
                ok: false,
                msg: 'No existe trabajador con ese ID (actualizarTrabajador)'
            })
        }
        //HA PASADO EL CORTE DE QUE EL USUARIO EXISTE
        // Ahora, en campos grabamos los nuevos datos a actualizar
        //y quitamos lo que no queremos que se lea
        const cambiosTrabajador = {...req.body, usuario: uid };
        //mete en una constante lo que mandamos como id, los campos del body y que nos devuelva lo nuevo
        const trabajadorActualizado = await Trabajador.findByIdAndUpdate(id, cambiosTrabajador, { new: true });




        res.json({
            ok: true,
            msg: "Trabajador actualizado",
            currante: trabajadorActualizado
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({

            msg: 'Error en actualizarTrabajador/try-catch'
        });

    }
}
const borrarTrabajador = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const trabajadorDB = await Trabajador.findById(uid);

        if (!trabajadorDB) {

            return res.status(404).json({
                ok: false,
                msg: ' No existe el trabajador con ese ID'
            })
        }

        //mete en una constante lo que mandamos como id, los campos del body y que nos devuelva lo nuevo
        await Trabajador.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'despidos, hola!',
            uid
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({

            msg: 'Error en borrarTrabajador/trycatch'
        });

    }

}



module.exports = { getTrabajador, crearTrabajador, updateTrabajador, borrarTrabajador };