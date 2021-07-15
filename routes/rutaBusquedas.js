/*
  Ruta:   /api/todo/:busquedas
*/


const { Router } = require('express');
const { check } = require('express-validator');

//---------------CREAMOS EL CONTROLADOR PARA LIMPIEZA DE CODIGO-----------------------//
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedaController');

//---------------- VALIDACION DE CAMPOS- MIDDLEWARE ------------//
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Las rutas, lo primero que haremos tras llamar al express
// Ruta : api/usuarios

router.get('/:busqueda', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getTodo);


module.exports = router;