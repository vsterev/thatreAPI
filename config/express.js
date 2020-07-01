const express = require('express');
const handlebars = require('express-handlebars');
const routes = require('../routes')
const cookieParser = require('cookie-parser');
const playController = require('../controllers/play')

module.exports = (app) => {

    app.engine('.hbs', handlebars({
        extname: '.hbs'
    }));
    app.set('view engine', '.hbs');
    app.use(express.json()); //this is to use json in api
    // app.use(express.urlencoded({ extended: true })); //to recognize req.body in post request
    app.use(cookieParser());

    app.use('/static', express.static('static'));
    app.use('/api', routes.home);
    app.use('/api/home', routes.home);
    app.use('/api/user', routes.user);
    app.use('/api/play', routes.play);
    app.use('*', playController.get.notFound)
};