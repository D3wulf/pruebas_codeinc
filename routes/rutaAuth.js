// RUTA 'API/LOGIN //

const { Router } = require('express');
//Validadores
const { check } = require('express-validator');

//---------------- VALIDACION DE CAMPOS- MIDDLEWARE ------------//
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { login, googleSignIn, renewToken } = require('../controllers/authController')

//---------------- VALIDACION DE CAMPOS- MIDDLEWARE ------------//
//const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


//Las rutas, lo primero que haremos tras llamar al express
// Ruta : api/usuarios

router.post('/', [

    check('email', 'El mail es obligatorio').isEmail(),
    check('password', "El password es obligatorio").isLength({ min: 6 }),
    //ULTIMO PORQUE COGERA LOS CHECKS
    validarCampos

], login);

router.post('/google', [

    check('token', 'Token Google obligatorio').not().isEmpty(),

    //ULTIMO PORQUE COGERA LOS CHECKS
    validarCampos

], googleSignIn);

router.get('/renew', validarJWT, renewToken);


module.exports = router;