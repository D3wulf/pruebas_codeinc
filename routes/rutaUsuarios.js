const { Router } = require('express');
//Validadores
const { check } = require('express-validator');


//---------------CREAMOS EL CONTROLADOR PARA LIMPIEZA DE CODIGO-----------------------//
const { getUsuarios, crearUsuario, actualizaUsuarios, borrarUsuario } = require('../controllers/usuarios-controller');

//---------------- VALIDACION DE CAMPOS- MIDDLEWARE ------------//
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
// const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


//Las rutas, lo primero que haremos tras llamar al express
// Ruta : api/usuarios

router.get('/', validarJWT, getUsuarios);

//Creacion users
router.post('/', [
    check('nombre', "El campo nombre no puede estar vacío").not().isEmpty(),
    check('email', 'El mail es obligatorio').isEmail(),
    check('password', "El password es obligatorio").isLength({ min: 6 }),
    //ULTIMO PORQUE COGERA LOS CHECKS
    validarCampos
], crearUsuario);


//actualizar usuarios
router.put('/:id', validarJWT, [
    check('nombre', "El campo nombre no puede estar vacío").not().isEmpty(),
    check('email', 'El mail es obligatorio').isEmail(),
    //check('role', "El rol es obligatorio").not().isEmpty(),
    //ULTIMO PORQUE COGERA LOS CHECKS
    validarCampos
], actualizaUsuarios);

router.delete('/:id', validarJWT, borrarUsuario);



module.exports = router;