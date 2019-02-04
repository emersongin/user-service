const mongoDB = require('../config/database');
const modelUser = require('../model/user');
const responseHand = require('./response-hand');

class ControllerResponse{

    async getUsers(filter, callback){
        try{
            const databaseConnection = await this.connect();
            const usersFound = await getUsersDatabase();

            callback(usersFound);
        }catch(error){
            callback(error);
        }finally{
            await this.disconnect();
        }

        function getUsersDatabase(){
            return new Promise(async function(resolve, reject){
                try{
                    const queryData = await modelUser.find(filter).exec();

                    if(queryData.empty()){
                        return reject({
                            body: {
                                name: "Not found",
                                description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                                message: "Check the request parameter; :id."
                            }, 
                            status: responseHand.statusCodes.clientError.notFound
                        });
                    }else{
                        return resolve({
                            body: queryData.map(responseHand.createLinksGet),
                            status: responseHand.statusCodes.success.ok
                        });
                    }
                }catch(error){
                    return reject({
                        body: error,
                        status: responseHand.statusCodes.clientError.badRequest
                    });
                }
            });
        }
    }
    
    async createUsers(dataCreate, callback){
        try{
            const databaseConnection = await this.connect();
            const usernames = await checkUsernames();
            const usersCreated = await createUsersDatabase();

            callback(usersCreated);       
        }catch(error){
            callback(error);
        }finally{
            await this.disconnect();
        }

        function checkUsernames(){
            let usernames;

            if(Array.isArray(dataCreate)){
                usernames = dataCreate.map(object => object['username']);
            }else{
                usernames = dataCreate.username;
            }

            return new Promise(async function(resolve, reject){
                const query =  modelUser.find({username: {$exists: true, $in: usernames}}, 'username');
                
                try{
                    const queryData = await query.exec();

                    if(queryData.empty()){
                        return resolve([null]);
                    }else{
                        return reject(errorResponse({
                            name: 'UsernamesExists',
                            data
                        }));
                    }
                }catch(error){
                    return reject(errorResponse(error));
                }
            });
        }

        function createUsersDatabase(){
            return new Promise(async function(resolve, reject){
                try{
                    const createdUsers = await modelUser.insertMany(dataCreate);

                    return resolve({
                        body: createdUsers,
                        status: responseHand.statusCodes.success.created
                    });
                }catch(error){
                    return reject(errorResponse(error));
                }
            });
        }

        function errorResponse(error){
            switch(error.name){
                case 'UsernamesExists':
                    return {
                        body: {
                            name: "Duplicate resource",
                            description: "The request could not be completed due to a conflict with the current state of the target resource.",
                            message: "Usernames is exists.",
                            usernames: error.data
                        }, 
                        status: responseHand.statusCodes.clientError.conflict
                    };
                break;
                case 'ValidationError':
                    return {
                        body: error,
                        status: responseHand.statusCodes.clientError.forbidden
                    };
                break;
                default :
                    return {
                        body: error,
                        status: responseHand.statusCodes.clientError.badRequest
                    };
            }
        } 
    }
    
    async updateUsers(filter, dataUpdate, optios, callback){
        try{
            const databaseConnection = await this.connect();
            const usersUpdated = await updateUsersDatabase();

            callback(usersUpdated);
        }catch(error){
            callback(error);
        }finally{
            await this.disconnect();
        }

        function updateUsersDatabase(){
            return new Promise(async function(resolve, reject){                
                try{
                    const queryData = await modelUser.update(filter, dataUpdate, optios);

                    if(queryData.ok && queryData.nModified){
                        return resolve({
                            body: queryData,
                            status: responseHand.statusCodes.success.ok
                        });
                    }else{
                        return reject({
                            body: {
                                name: "Not found",
                                description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                                message: "Check the request parameter; :id."
                            }, 
                            status: responseHand.statusCodes.clientError.notFound
                        });
                    }
                }catch(error){
                    return reject({
                        body: error, 
                        status: responseHand.statusCodes.clientError.badRequest
                    });
                }
            });
        }
    }
    
    deleteUser(userID, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error, null);
            }else{
                deleteUserDatabase();
            }
        });

        function deleteUserDatabase(){
            modelUser.findByIdAndDelete(userID, function(error, data){
                if(error){
                    return callback({
                        body: error, 
                        status: responseHand.statusCodes.clientError.badRequest
                    }, null);

                }else if(!data){
                    return callback({
                        body: {
                            name: "Resource is gone",
                            description: "The target resource is no longer available at the origin server and that this condition is likely to be permanent.",
                            message: "Check the request parameter; :id."
                        }, 
                        status: responseHand.statusCodes.clientError.gone
                    }, null);

                }else{
                    return callback(null, {
                        body: data,
                        status: responseHand.statusCodes.success.noContent
                    });

                }
            });
        }
    }
    
    connect(){
        return new Promise((resolve, reject) => {
            mongoDB.connect().then(databaseConnection => {
                resolve(databaseConnection);

            }).catch(error => {
                reject(error);

            });
        });
    }

    disconnect(){
        return new Promise((resolve, reject) => {
            mongoDB.disconnect().then(dataBaseClose => {
                resolve(dataBaseClose);

            }).catch(error => {
                reject(error);

            });
        });
    }

}


module.exports = new ControllerResponse();