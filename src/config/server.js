const expressModule = require('express');

const CORS = require('./cors');
const middlewareHelmet = require('helmet');

const userAPI = require('../api/user-api');

class ServerController{
    constructor(){
        this.express = expressModule();
        this.port = process.env.SERVER_PORT;

        this.useMiddleware(this.express);
        this.useRoutes(this.express);
    }

    useMiddleware(express){
        express.use(CORS);
        
        //express.use(middlewareHelmet);
        
        express.use(expressModule.json({
            type: 'json'
        }));

        express.use(expressModule.urlencoded({
            type: 'urlencoded', 
            extended: true 
        }));
    }

    useRoutes(express){
        userAPI(express);
    }
}

module.exports = new ServerController();