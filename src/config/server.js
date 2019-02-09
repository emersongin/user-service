const expressModule = require('express');
const expressServer = expressModule();

const middlewareHelmet = require('helmet');
const middlewareBodyParser = require('body-parser');
const CORS = require('./cors');

const config = require('dotenv');
//config.config({ path: 'C:/node/user-service/src/config/.env' });
config.load();

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

    expressServer.listen(process.env.SERVER_PORT, function(){
        console.log(`SERVER is running in port: ${process.env.SERVER_PORT}`);
    });

}

function disconnect(){

}

module.exports = {expressServer, connect};