const express = require("express");
const fs = require("fs");
const path = require("path");
const { verificaTokenImg } = require('../middlewares/autenticacion')


let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathimg = path.resolve(__dirname, `../../upload/${tipo}/${img}`);

    if (fs.existsSync(pathimg)) {
        res.sendFile(pathimg)
    } else {
        res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'))
    }
});



module.exports = app;