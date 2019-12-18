const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ///
// ///  Mostrar todas las categorias
// ///
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});



// ///
// ///  Mostrar una  categorias por ID
// ///
app.get('/categoria/:id', verificaToken, (req, res) => {


    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no es valido"
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

///
///  Crear nueva categoria
///
app.post('/categoria', verificaToken, (req, res) => {

    // regresa la nueva categoria
    // req.usuario.id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })

        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });


});

///
///  Mostrar todas las categorias
///
app.put('/categoria/:id', (req, res) => {


    let id = req.params.id;
    let body = req.body;

    let udpCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, udpCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});
// ///
// ///  Mostrar todas las categorias
// ///
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            })

        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id No Existe"
                }
            });
        }

        res.json({
            ok: true,
            message: "Categoria borrada"
        });



    });

});

module.exports = app;