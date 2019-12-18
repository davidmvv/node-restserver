const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require("../models/producto");


//==========================================
// Obtener producto 
//==========================================

app.get('/productos', (req, res) => {
    //trae todos los productos 
    //populate: uusaurio, categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productosDB
            })

        });
});

//==========================================
//Obtener un producto por ID 
//==========================================
app.get('/productos/:id', (req, res) => {
    //populate: usuario, categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El id no es valido"
                    }
                });
            }
            res.json({
                ok: true,
                productoBD
            });

        });
});


//==========================================
// Buscar productos
//==========================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    console.log(regex);

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        })
})

//==========================================
// Crear un nuevo producto
//==========================================

app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario 
    //grabar una categoria

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id //se obtiene del token

    });

    producto.save((err, productoBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })

        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoBD
        })

    });

});


//==========================================
// Actualizar producto
//==========================================

app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El Producto no existe"
                }
            });
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcione;

        productoBD.save((err, productoUDP) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoUDP
            })

        });






    })


});
//==========================================
// Eliminar producto
//==========================================

app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El Producto no existe"
                }
            });
        }

        productoBD.disponible = false;

        productoBD.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: "producto Borrado"
            })
        })




    });


});
//==========================================
// 
//==========================================

module.exports = app;