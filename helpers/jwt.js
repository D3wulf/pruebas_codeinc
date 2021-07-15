//creacion del jason web token

const jwt = require("jsonwebtoken")

const generarJWT = (uid) => {


    //devolvemos la promesa para tener un resolve y un rej
    return new Promise((resolve, reject) => {

        const payload = { uid };

        //lo que va a coger, el secret mio, opciones

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (error, token) => {

            if (error) {
                console.log(error);
                reject(error);
            } else {
                //todo ha ido bien
                resolve(token);
            }
        })

    });
}

module.exports = {
    generarJWT
}