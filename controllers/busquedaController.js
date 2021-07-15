const { response } = require('express');

const Usuario = require('../models/usuario');
const Trabajador = require('../models/trabajador');
const Empresa = require('../models/empresa');

const getTodo = async(req, res = response) => {

    //Lo que vamos a buscar lo que va en la url
    const busqueda = req.params.busqueda;

    //expresion regular para que lo vea todo la i es de insensible, para que busque
    //todo lo que contenga algo
    const regex = new RegExp(busqueda, 'i');

    //select usuario from usuario where nombre=busqueda
    // esto buscaria de forma secuencial

    // const usuario = await Usuario.find({ nombre: regex })
    // const trabajador = await Trabajador.find({ nombre: regex })
    // const empresa = await Empresa.find({ nombre: regex })

    // Esto buscaría de forma simultanea
    const [usuario, trabajador, empresa] = await Promise.all([

        Usuario.find({ nombre: regex }),
        Trabajador.find({ nombre: regex }),
        Empresa.find({ nombre: regex }),


    ])

    res.json({
        ok: true,
        msg: "Hola desde las busquedas de empresa",
        usuario,
        trabajador,
        empresa
    })
}


const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {

        case 'trabajadores':
            data = await Trabajador.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('empresa', 'nombre img');
            break;

        case 'empresas':
            data = await Empresa.find({ nombre: regex })
                .populate('usuario', 'nombre img');;
            break;

        case 'usuarios':
            const data = await Usuario.find({ nombre: regex })
            break;
        default:
            return res.status(400).json({

                ok: false,
                msg: ' La tabla debe ser trabajadores, empresas o usuarios'
            });
    }
    res.json({
        ok: true,
        resultados: data
    });
}
module.exports = { getTodo, getDocumentosColeccion };