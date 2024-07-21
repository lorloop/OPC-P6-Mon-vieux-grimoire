const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

mongoose.connect('mongodb+srv://mvg:AqOE13xgbu9eYYad@mvg-db.evagwgp.mongodb.net/?retryWrites=true&w=majority&appName=MVG-DB')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ALLOWED_ORIGINS);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', authRoutes);

module.exports = app;