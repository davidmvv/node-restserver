//================
// PUERTO
//================

process.env.PORT = process.env.PORT || 3000;


//================
// Entorno
//================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================
// Base de datos
//================

let urlDB;

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/cafe'
// } else {
urlDB = 'mongodb+srv://sa_david:L1pv7UYKgLTgkTNM@cluster0-ekdgo.mongodb.net/cafe?retryWrites=true&w=majority'
    // }

process.env.URLDB = urlDB;