//para las ayudas del visual code
const { response } = require('express');

// nos traemos el modelo para que al crear usuario, rellenemos sus campos ya que los tememos del req.body
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/googleVerify');



const login = async(req, res = response) => {

        //cogemos lo que queremos
        const { email, password } = req.body;



        try {
            // Verificar email
            const usuarioDB = await Usuario.findOne({ email });

            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Email no encontrado en login'
                });
            }

            //verificar contraseña
            const validPassword = bcrypt.compareSync(password, usuarioDB.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña no válida'
                });
            }

            // Generar el JWT
            const token = await generarJWT(usuarioDB.id);

            res.json({
                ok: true,
                msg: 'todo correcto en mail/pass',
                token
            })


        } catch (error) {

            res.status(500).json({
                ok: false,
                msg: 'Fallo en el authcontroller'
            })
        }


    }
    //CUIDADO QUE A VECES TARDA UN HUEVO
const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;


    try {

        const { name, email, picture } = await googleVerify(googleToken);
        //verificar si existe en bbdd
        let usuario;

        const usuarioDB = await Usuario.findOne({ email });
        //Si no existe
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@',
                img: picture,
                google: true
            })
        } else {

            //si existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            //usuario.password = '@@@';
        }

        //guardar en bd
        await usuario.save();

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        })

    } catch (err) {
        res.json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }



}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
    const usuario = await Usuario.findById(uid)

    // Generar el JWT
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = { login, googleSignIn, renewToken };