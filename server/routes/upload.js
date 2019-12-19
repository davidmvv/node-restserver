const express = require('express');
const fileUpload = require('express-fileupload');

const path = require("path");

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');


app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "No se ha seleccionado ningún archivo"
                }
            });
    }

    //validar tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(200)
            .json({

                ok: false,
                err: {
                    message: 'Los tipos permitidas son: ' + tiposValidos.join(', ')
                }
            });
    }


    let archivo = req.files.archivo;
    let noombreCortado = archivo.name.split('.');
    let extension = noombreCortado[noombreCortado.length - 1];

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(200)
            .json({

                ok: false,
                err: {
                    message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
                }
            });
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(path.resolve(__dirname, '../../upload') + `/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                });
        }

        //Aquí la imagen se cargo

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nomnreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nomnreArchivo, 'usuarios')
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }



        if (!usuarioDB) {
            borraArchivo(nomnreArchivo, 'usuarios')
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: "Usuario no existe"
                    }
                })
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nomnreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nomnreArchivo
            })

        });
    });
}

function imagenProducto(id, res, nomnreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nomnreArchivo, 'productos')
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }



        if (!productoDB) {
            borraArchivo(nomnreArchivo, 'productos')
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: "Producto no existe"
                    }
                })
        }

        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nomnreArchivo;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nomnreArchivo
            })

        });
    });
}


function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}




module.exports = app;