const expressModule = require('express');
const expressServer = expressModule();

const middlewareHelmet = require('helmet');
const middlewareBodyParser = require('body-parser');
const CORS = require('./cors');
const config = require('./.env');

function connect(){
    //expressServer.use(middlewareHelmet());

    expressServer.use(CORS);

    expressServer.use(middlewareBodyParser.json({
        type: 'json'
    }));

    expressServer.use(middlewareBodyParser.urlencoded({
        type: 'urlencoded', 
        extended: true 
    }));

    expressServer.listen(config.SERVER_PORT, function(){
        console.log(`SERVER is running in port: ${config.SERVER_PORT}`);
    });

}

function disconnect(){

}

module.exports = {expressServer, connect};