/*
  Ruta:   /api/empresas
*/
const { Router } = require('express');
const { check } = require('express-validator');

//---------------CREAMOS EL CONTROLADOR PARA LIMPIEZA DE CODIGO-----------------------//
const { getEmpresas, crearEmpresa, updateEmpresa, borrarEmpresa } = require('../controllers/empresaController');

//---------------- VALIDACION DE CAMPOS- MIDDLEWARE ------------//
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Las rutas, lo primero que haremos tras llamar al express
// Ruta : api/usuarios

router.get('/', validarJWT, getEmpresas);

//Creacion users
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre de la empresa es obligatorio').not().isEmpty(),
    validarCampos
], crearEmpresa);


//actualizar usuarios
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre de la empresa es obligatorio').not().isEmpty(),
    validarCampos
], updateEmpresa);

router.delete('/:id', validarJWT, borrarEmpresa);



module.exports = router;