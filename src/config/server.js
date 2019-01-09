const expressModule = require('express');
const expressServer = expressModule();

const middlewareHelmet = require('helmet');
const middlewareBodyParser = require('body-parser');
const CORS = require('./cors');
const serverPort = 3000;

function connect(){
    expressServer.use(middlewareHelmet());
    expressServer.use(CORS);
    expressServer.use(middlewareBodyParser.json());
    expressServer.use(middlewareBodyParser.urlencoded({ extended: true }));
    expressServer.listen(serverPort, function(){
        console.log(`SERVER is running in port: ${serverPort}`);
    });
}

function disconnect(){

}

module.exports = { expressServer, connect };