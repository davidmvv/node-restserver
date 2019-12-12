require("./config/config")


const express = require('express')
    // Using Node.js `require()`
const mongoose = require('mongoose');

const app = express()

const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require("./routes/usuario"));



// parse application/json
app.use(bodyParser.json())

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log("Base de datos Online: ", process.env.URLDB);
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto `, process.env.PORT);

})