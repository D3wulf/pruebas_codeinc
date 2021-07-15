//con fs puedo leer los archivos 
const fs = require('fs')
const Usuario = require('../models/usuario');
const Empresa = require('../models/empresa');
const Trabajador = require('../models/trabajador');
let pathViejo;


const borrarImg = (path) => {
    if (fs.existsSync(pathViejo)) {
        //borramos img anterior
        fs.unlinkSync(pathViejo);
    }

}


const actualizarImagen = async(tipo, id, nombreArchivo) => {

    switch (tipo) {

        case 'trabajadores':
            const trabajador = await Trabajador.findById(id);
            if (!trabajador) {
                //no se encontro el trabajador por id
                return false;
            }

            pathViejo = `./uploads/trabajadores/${trabajador.img}`;

            borrarImg(pathViejo);

            trabajador.img = nombreArchivo;
            await trabajador.save();
            return true;

            break;

        case 'empresas':

            const empresa = await Empresa.findById(id);
            if (!empresa) {
                //no se encontro la empresa por id
                return false;
            }

            pathViejo = `./uploads/empresas/${empresa.img}`;

            borrarImg(pathViejo);

            empresa.img = nombreArchivo;
            await empresa.save();
            return true;
            break;


        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if (!usuario) {
                //no se encontro el usuario por id
                return false;
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`;

            borrarImg(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;





    }


}


module.exports = { actualizarImagen }