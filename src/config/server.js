const expressModule = require('express');
const expressServer = expressModule();

const middlewareHelmet = require('helmet');
const middlewareBodyParser = require('body-parser');
const CORS = require('./cors');

class ServerConnection{
    constructor(){
        this.serverPort = process.env.SERVER_PORT;
    }

    connect(){
        return new Promise((resolve, reject) =>{
   
            expressServer.use(CORS);
    
            expressServer.use(middlewareBodyParser.json({
                type: 'json'
            }));
    
            expressServer.use(middlewareBodyParser.urlencoded({
                type: 'urlencoded', 
                extended: true 
            }));
            
            expressServer.listen(this.serverPort, function serverHTTP(){
                console.log(`SERVER is running in port: ${this._connectionKey}`);
                resolve(expressServer);
            });

            reject(`SERVER connect error in port: ${process.env.SERVER_PORT}`);
        });
    }
    
    disconnect(){
        return Promise((resolve, reject) => {

        });
    }
}


module.exports = new ServerConnection();