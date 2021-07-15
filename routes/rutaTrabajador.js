/*
  Ruta:   /api/trabajadores
*/
const { Router } = require('express');
const { check } = require('express-validator');

//---------------CREAMOS EL CONTROLADOR PARA LIMPIEZA DE CODIGO-----------------------//
const { getTrabajador, crearTrabajador, updateTrabajador, borrarTrabajador } = require('../controllers/trabajadorController');

//---------------- VALIDACION DE CAMPOS- MIDDLEWARE ------------//
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Las rutas, lo primero que haremos tras llamar al express
// Ruta : api/usuarios

router.get('/', getTrabajador);

//Creacion users
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del trabajador es obligatorio').not().isEmpty(),
    check('empresa', 'El id de la empresa es obligatorio y válido').not().isEmpty().isMongoId(), //Aqui validamos el mongoId
    validarCampos
], crearTrabajador);


//actualizar usuarios
router.put('/:id', [validarJWT,
    check('nombre', "El campo nombre no puede estar vacío").not().isEmpty(),
    check('empresa', 'El nombre de la empresa es obligatorio').not().isEmpty(),
    validarCampos
], updateTrabajador);

router.delete('/:id', validarJWT, borrarTrabajador);



module.exports = router;