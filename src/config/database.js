const mongooseModule = require('mongoose');
const databaseHostname = 'localhost';
const databasePort = '27017';
const databaseName = 'users';
const responseHTTP = require('../controller/response-http');

let databaseConnection = null;

function connect(callback){
    let connectOptions = {
        useNewUrlParser: true
    };

    if(databaseConnection){
        return callback(null, databaseConnection.db);
    }

    mongooseModule.connect(`mongodb://${databaseHostname}:${databasePort}/${databaseName}`, connectOptions, function(error){
        if(error){
            consoleMessage('ERROR_CONNECT_DATABASE');
            
            return callback({
                data: error,
                status: responseHTTP.statusCodes.serverError.internalServerError
            }, null);

        }else{
            databaseConnection = mongooseModule.connection;
            consoleMessage('CONNECTED_DATABASE');

            return callback(null, databaseConnection.db);
        }
    });
}

function disconnect(callback){
    if(!databaseConnection){
        return callback(true);
    }

    databaseConnection.close(true, function(){
        databaseConnection = null;
        consoleMessage('DISCONNECTED_DATABASE');

        return callback(true);
    });
}

function consoleMessage(description){
    let message = null;

    switch(description){
        case 'CONNECTED_DATABASE': 
            message = `DATABASE: ${databaseName}, connected on port: ${databasePort}`;
            break;
        case 'ERROR_CONNECT_DATABASE':
            message = `Connection error in DATABASE: ${databaseName} on port: ${databasePort}`;
            break;
        case 'DISCONNECTED_DATABASE':
            message = `DATABASE: ${databaseName}, is disconnected!`;
            break;
    };

    console.log(message);
}

module.exports = {connect, disconnect};