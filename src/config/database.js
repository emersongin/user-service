const mongooseModule = require('mongoose');
const responseHand = require('../controller/response-hand');

class DataBaseConnect{
    constructor(){
        this.databaseHostname = 'localhost';
        this.databasePort = '27017';
        this.databaseName = 'users';
        this.databaseConnection = null;
    }

    connect(){
        let connection = `mongodb://${this.databaseHostname}:${this.databasePort}/${this.databaseName}`;

        let connectOptions = {
            useNewUrlParser: true
        };

        return new Promise((resolve, reject) => {
            if(this.databaseConnection){
                resolve(this.databaseConnection.db);
            }

            mongooseModule.connect(connection, connectOptions)
                .then(connectionMongoDB => {
                    this.databaseConnection = connectionMongoDB;
                    resolve(this.databaseConnection.db);

                    console.log(`DATABASE: ${this.databaseName}, connected on port: ${this.databasePort}`);
                }).catch(error => {
                    reject({
                        body: error,
                        status: responseHand.statusCodes.serverError.internalServerError
                    });

                    console.log(`Connection error in DATABASE: ${databaseName} on port: ${databasePort}`);
                });
        });
    }

    disconnect(){
        return new Promise((resolve, reject) => {
            if(!this.databaseConnection){
                resolve(true);
            }

            mongooseModule.connection.close()
                .then(disconnectionMongoDB => {
                    this.databaseConnection = null;
                    resolve(true);

                    console.log(`DATABASE: ${this.databaseName}, is disconnected!`);
                }).catch(error => {
                    reject(error);

                });
        });
    }

}

module.exports = new DataBaseConnect();