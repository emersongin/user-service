const mongoDB = require('../config/database');
const modelUser = require('../model/user');
const responseHand = require('./response-hand');

class ControllerResponse{

    async getUsers(filter, callback){
        try{
            const databaseConnection = await this.connect();
            const users = await getUsersDatabase();

            callback(users);
            
        }catch(error){
            callback(error);

        }finally{
            await this.disconnect();

        }

        function getUsersDatabase(){
            return new Promise(async function(resolve, reject){
                const query = modelUser.find(filter);

                try{
                    const data = await query.exec();

                    if(data.empty()){
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
                            body: data.map(responseHand.createLinksGet),
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
    
    async createUsers(usersData, callback){
        try{
            const databaseConnection = await this.connect();
            const usernames = await checkUsernames();
            const newUsers = await createUsersDatabase();

            callback(newUsers);
            
        }catch(error){
            callback(error);

        }finally{
            await this.disconnect();

        }

        function checkUsernames(){
            let usernames;

            if(Array.isArray(usersData)){
                usernames = usersData.map(object => object['username']);
            }else{
                usernames = usersData.username;
            }

            return new Promise(async function(resolve, reject){
                const query =  modelUser.find({username: {$exists: true, $in: usernames}}, 'username');
                
                try{
                    const data = await query.exec();

                    if(data.empty()){
                        return resolve(data);
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
                    const data = await modelUser.insertMany(usersData);

                    return resolve({
                        body: data,
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
    
    async replaceUser(filter, userDataReplace, callback){
        try{
            const databaseConnection = await this.connect();
            const usersReplace = await replaceUsersDatabase();

            callback(usersReplace);
            
        }catch(error){
            callback(error);

        }finally{
            await this.disconnect();

        }

        function replaceUsersDatabase(){
            return new Promise(async function(resolve, reject){
                const query = modelUser.update(filter, {$set: userDataReplace.username}, {overwrite: true});
                
                try{
                    const data = await query.exec();

                    if(data.empty()){
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
                            body: data,
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

    updateUser(userID, userData, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error, null);
            }else{
                updateUserDatabase();
            }
        });

        function updateUserDatabase(){
            modelUser.findByIdAndUpdate(userID, {$set: userData}, {
                new: true, 
                runValidators: true
            }, function(error, data){
                if(error){
                    return callback({
                        body: error, 
                        status: responseHand.statusCodes.clientError.badRequest
                    }, null);

                }else if(!data){
                    return callback({
                        body: {
                            name: "Not found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "Check the request parameter; :id."
                        }, 
                        status: responseHand.statusCodes.clientError.notFound
                    }, null);

                }else{
                    return callback(null, {
                        body: data,
                        status: responseHand.statusCodes.success.ok
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