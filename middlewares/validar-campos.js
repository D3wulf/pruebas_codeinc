const { response } = require("express");
const { validationResult } = require("express-validator");

//llamamos a next cuando todo sucede correctamente
const validarCampos = (req, res = response, next) => {

    //de express validators, aqui guarda los errores
    const errors = validationResult(req);
    //si los errores no están vacios
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            //te manda un json de los errores que estan en la ruta auth
            errors: errors.mapped()
        });
    }

    // si no hay errores, sigue la funcion
    next();


}


module.exports = {
    validarCampos
}