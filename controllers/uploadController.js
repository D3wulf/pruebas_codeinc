// npm i express-fileupload

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizarImg");

const path = require('path');
const fs = require('fs');




const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['usuarios', 'trabajadores', 'empresas'];
    //Validacion en parametros de busqueda /api/upload/:tipo <--
    if (!tiposValidos.includes(tipo)) {

        return res.status(400).json({

            ok: false,
            msg: 'Debe seleccionar como parametro, usuarios, trabajadores o empresas'
        })
    }
    //c&p de la pagina de expressupload
    //Validacion de que exista archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha encontrado archivo'

        })
    }
    //Procesamiento imagen //en body/key
    const file = req.files.imagen;
    //dividimos el nombre de la imagen en un array, necesitamos coger la extension
    const nombreCortado = file.name.split('.');
    console.log(nombreCortado);
    //un array en -1 es coger la ultima posicion del mismo, en este caso
    //cogeriamos la extension solo
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    console.log(extensionArchivo);

    //Validamos extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extensión del archivo no válida'
        })
    }
    console.log(extensionesValidas);



    //Generamos el nombre del archivo, evitamos que los usuarios dupliquen nombres
    //usamos el UUID npm i uuid, generamos el nuevo nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //path para guardar imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({

                ok: false,
                msg: 'Error al guardar el archivo'
            });
        }


        //Actualizar bbdd (evitar duplicados, basura...)creamos un helper
        actualizarImagen(tipo, id, nombreArchivo);


        res.json({
            ok: true,
            msg: 'Eres un maquinon, has subido el archivo con éxito',
            img: file.name

        });
    });




}

const miImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/hola.png`);
        res.sendFile(pathImg);
    }



}

module.exports = { fileUpload, miImagen }