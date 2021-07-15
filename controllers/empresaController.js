const { response } = require('express');

const Empresa = require('../models/empresa');

const getEmpresas = async(req, res = response) => {
    //select y el populate es para ver quien lo creó
    const empresas = await Empresa.find().populate('usuario', 'nombre email img')

    res.json({
        ok: true,
        empresas
    })
}

const crearEmpresa = async(req, res = response) => {


    //AQui sabemos quien hizo la request
    const uid = req.uid;

    //Desestructuramos el req body, esto va debajo del uid para la asignacion al usuario
    // ya que vamos a asignar al modelo en la parte del usuario, la uid
    const empresa = new Empresa({
        usuario: uid,
        ...req.body
    });


    try {

        const empresaDB = await empresa.save();

        res.json({
            ok: true,
            msg: 'Todo correcto al crear la empresa',
            empresa: empresaDB
        })


    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: 'Error al crearEmpresa'
        })

    }



}

const updateEmpresa = async(req, res = response) => {
    //Sacamos la id de la url
    const id = req.params.id;
    //cogemos la uid del que hizo la peticion para mostrarlo
    const uid = req.uid;


    try {

        const empresa = await Empresa.findById(id);

        if (!empresa) {

            res.status(500).json({
                ok: false,
                msg: 'Empresa no encontrada',
            });

        }

        const cambiosEmpresa = {
                ...req.body,
                usuario: uid
            }
            // el update
        const empresaActualizada = await Empresa.findByIdAndUpdate(id, cambiosEmpresa, { new: true });


        res.json({
            ok: true,
            msg: 'Nombre de empresa actualizada',
            nuevoNombre: empresaActualizada
        });


    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Fallo al actualizar empresa',
        });

    }


}
const borrarEmpresa = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const empresaDB = await Empresa.findById(uid);

        if (!empresaDB) {

            return res.status(404).json({
                ok: false,
                msg: ' No existe la empresa con ese ID'
            })
        }

        //mete en una constante lo que mandamos como id, los campos del body y que nos devuelva lo nuevo
        await Empresa.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Empresa borrada!',
            uid
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({

            msg: 'Error en borrarUsuario/trycatch'
        });

    }

}



module.exports = { getEmpresas, crearEmpresa, updateEmpresa, borrarEmpresa };