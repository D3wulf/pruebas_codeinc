const { response } = require("express");

const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    //los tokens van en el postman en header

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "Error en TOken-Middleware, no existe"

        });
    }

    try {
        //extraemos del jwt.verify los datos y deconstruimos para coger el uid
        const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        //queremos pasar el id al controlador si el token ha sido correcto

        req.uid = uid;


    } catch (error) {

        return res.status(401).json({

            ok: false,
            msg: "Token no válido"
        });

    }

    next();
}

module.exports = {
    validarJWT
}