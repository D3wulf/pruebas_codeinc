// nos traemos el modelo para que al crear usuario, rellenemos sus campos ya que los tememos del req.body
const Usuario = require('../models/usuario');
// para cuando haya algun error, podamos poner el res.status
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');




const crearUsuario = async(req, res) => {
    // es lo que mando por postman, para añadir campos, añadirlos al modelo también!
    const { nombre, password, email } = req.body

    //usamos el try catch para capturar errores, como el mail duplicado

    try {

        // como solo queremos un dato, podemos usar el findOne, seria como un select pero concreto
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {

            return res.status(400).json({
                ok: false,
                msg: 'Correo ya existe'

            })
        }

        //Usuario viene del modelo
        const usuario = new Usuario(req.body);

        //Antes de grabar encriptamos
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);



        //como ya tenemos la conexion a la base de datos, esto seria lo similar al insert into 
        await usuario.save();

        // Generar el JWT, despues del save ya que no tenemos el id
        const token = await generarJWT(usuario.id);


        res.status(200).json({
            ok: true,
            msg: "Hola desdel post/crear usuario",
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({

            msg: 'Error, puede ser correo duplicado, crearUsuario/try-catch'
        });
    }






}


const getUsuarios = async(req, res) => {

    //PAGINACION, si no manda valor, será 0
    const desde = Number(req.query.desde) || 0;

    //--------------------------ESTE CODIGO ES PERFECTAMENTE VALIDO-----------------//
    //--------------------------PERO USAMOS EL PROMISE ALL-----------------//

    //esto cogerá de la base de datos lo que hay, es como un select, entre llaves hacemos un filtro, similar al where
    //esto seria select nombre,email, google, role from usuarios

    // const usuarios = await Usuario
    //     .find({}, 'nombre email google role')
    //     //saltamos desde el numero que pongamos en la url
    //     .skip(desde)
    //     .limit(5)

    // el select count, o sea, ver el total de registros
    // const totalRegistros = await Usuario.count();

    //--------------------------FIN CODIGO VALIDO-----------------//


    // AQUI CREA UN ARRAY DE PROMESAS CON EL PROMISE ALL, ES UNA MEJORA AL CODIGO DE ARRIBA,
    // LO UNICO QUE HACE ES QUE LA CARGA SEA MAS RAPIDA
    const [usuarios, totalRegistros] = await Promise.all([
        Usuario
        .find({}, 'nombre email google role img')
        .skip(desde)
        .limit(5),
        Usuario.count()

    ])

    res.status(200).json({
            ok: true,
            msg: "Get Usuarios",
            usuarios,
            totalRegistros,
            //Esto viene de validar-Jwt y es para saber el id del que hizo la peticion
            uid: req.uid
        })
        //res.sendFile(path.resolve(__dirname, 'public/index.html'));

}


const actualizaUsuarios = async(req, res) => {

    // TODO: Aqui validamos token

    const uid = req.params.id

    console.log(uid);
    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {

            return res.status(404).json({
                ok: false,
                msg: ' No existe usuario con ese ID (actualizarUsuario)'
            })
        }


        //HA PASADO EL CORTE DE QUE EL USUARIO EXISTE
        // Ahora, en campos grabamos los nuevos datos a actualizar
        //y quitamos lo que no queremos que se lea
        const { google, password, email, ...campos } = req.body;

        //otro filtro, en este caso a si el mail es el mismo
        if (usuarioDB.email != email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Se ha intentado actualizar con un email ya cogido'
                })
            }
        }
        if (!usuarioDB.google) {

            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de Google no pueden actualizar su correo'
            })
        }



        //mete en una constante lo que mandamos como id, los campos del body y que nos devuelva lo nuevo
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });




        res.status(200).json({
            ok: true,
            msg: "Usuario actualizado",
            usuario: usuarioActualizado
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({

            msg: 'Error en actualizarUsuario/try-catch'
        });

    }

}
const borrarUsuario = async(req, res = response) => {

    // TODO: Aqui validamos token

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {

            return res.status(404).json({
                ok: false,
                msg: ' No existe usuario con ese ID (borrarUsuario)'
            })
        }

        //mete en una constante lo que mandamos como id, los campos del body y que nos devuelva lo nuevo
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: "Usuario borrado",
            uid
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({

            msg: 'Error en borrarUsuario/trycatch'
        });

    }

}





module.exports = { getUsuarios, crearUsuario, actualizaUsuarios, borrarUsuario };