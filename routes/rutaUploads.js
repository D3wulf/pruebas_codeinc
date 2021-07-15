/*
  Ruta:   /api/upload/:tipo/:id
*/


const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

//---------------CREAMOS EL CONTROLADOR PARA LIMPIEZA DE CODIGO-----------------------//
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedaController');
const { fileUpload, miImagen } = require('../controllers/uploadController');

//---------------- VALIDACION DE CAMPOS- MIDDLEWARE ------------//

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.use(expressFileUpload());

//Las rutas, lo primero que haremos tras llamar al express
// Ruta : api/usuarios

router.put('/:tipo/:id', validarJWT, fileUpload);
//HE TENIDO QUE QUITAR EL VALIDAR 
router.get('/:tipo/:foto', miImagen);


module.exports = router;