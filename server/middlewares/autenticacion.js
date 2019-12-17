//
//Verificar token
//

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, algo) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = algo.usuario;
        next();
    });
};

//
// Verificar adminRol
//

let verificaAdmin_Role = (req, res, next) => {
    let usuarios = req.usuario;
    if (usuarios.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no es Administrador'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
};