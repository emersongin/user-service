const mongooseModule = require('mongoose');
const responseHand = require('../controllers/response-hand');

class DataBaseConnection{
    constructor(){
        this.databaseHostname = process.env.DB_HOSTNAME;
        this.databasePort = process.env.DB_PORT;
        this.databaseName = process.env.DB_NAME;
        this.databaseConnection = null;

        mongooseModule.connection.on('connected', () =>{
            console.log(`DATABASE: ${this.databaseName}, connected on port: ${this.databasePort}`);
        });

        mongooseModule.connection.on('disconnected', () =>{
            console.log(`DATABASE: ${this.databaseName}, is disconnected!`);
        });

    }

    connect(){
        let connection = `mongodb://${this.databaseHostname}:${this.databasePort}/${this.databaseName}`;

        let connectOptions = {
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            useNewUrlParser: true
        };

        return new Promise(async (resolve, reject) => {
            if(this.databaseConnection){
                return resolve(this.databaseConnection);
            }

            try{
                this.databaseConnection = await mongooseModule.connect(connection, connectOptions);
                resolve(true);

            }catch(error){
                reject({
                    body: error,
                    status: responseHand.statusCodes.serverError.internalServerError
                });

            }
        });
    }

    disconnect(){
        return new Promise(async (resolve, reject) => {
            if(!this.databaseConnection){
                return resolve(true);
            }

            try{
                await mongooseModule.connection.close();
                this.databaseConnection = null;
                resolve(true);
                
            }catch(error){
                reject(error);

            }
        });
    }

}

module.exports = new DataBaseConnection();