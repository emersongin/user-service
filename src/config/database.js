const mongooseModule = require('mongoose');
const responseHand = require('../controllers/response-hand');

class DataBaseConnect{
    constructor(){
        this.databaseHostname = process.env.DB_HOSTNAME;
        this.databasePort = process.env.DB_PORT;
        this.databaseName = process.env.DB_NAME;
        this.databaseConnection = null;
    }

    connect(){
        let connection = `mongodb://${this.databaseHostname}:${this.databasePort}/${this.databaseName}`;

        let connectOptions = {
            useNewUrlParser: true
        };

        return new Promise((resolve, reject) => {
            if(this.databaseConnection){
                resolve(this.databaseConnection);
            }

            mongooseModule.connect(connection, connectOptions).then(connectionMongoDB => {
                    this.databaseConnection = connectionMongoDB;
                    resolve(this.databaseConnection);

                    console.log(`DATABASE: ${this.databaseName}, connected on port: ${this.databasePort}`);
                }).catch(error => {
                    reject({
                        body: error,
                        status: responseHand.statusCodes.serverError.internalServerError
                    });

                    console.log(`Connection error in DATABASE: ${this.databaseName} on port: ${this.databasePort}`);
                });
        });
    }

    disconnect(){
        return new Promise((resolve, reject) => {
            if(!this.databaseConnection){
                console.log(`DATABASE: ${this.databaseName}, connection not found!`);
                return resolve(true);
            }

            mongooseModule.connection.close().then(disconnectionMongoDB => {
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