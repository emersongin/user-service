const mongoDB = require('../config/database');
const modelUser = require('../model/user');
const responseHand = require('./response-hand');

class ControllerResponse{

    getUsers(filter, callback){
        function getUsersDatabase(){

            function findUsers(resolve, reject){
                modelUser.find(filter).then(data => {
                    if(data.empty()){
                        reject({
                            body: {
                                name: "Not found",
                                description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                                message: "Check the request parameter; :id."
                            }, 
                            status: responseHand.statusCodes.clientError.notFound
                        });
                    }else{
                        resolve({
                            body: data.map(responseHand.createLinksGet),
                            status: responseHand.statusCodes.success.ok
                        });
                    }

                }).catch(error => {
                    reject({
                        body: error,
                        status: responseHand.statusCodes.clientError.badRequest
                    });

                });
            };

            return new Promise(async (resolve, reject) => {
                await findUsers(resolve, reject);
            });

        }

        return Promise.all([this.connect(), getUsersDatabase()]).then(promises => {
            callback(promises[promises.lastIndex()]);

        }).catch(error => {
            callback(error);
            
        });
    }
    
    createUsers(usersData, callback){
   
        function checkUsernames(){
            let usernames;

            if(Array.isArray(usersData)){
                usernames = usersData.map(mapUsernames);
            }else{
                usernames = usersData.username;
            }

            function mapUsernames(object, index, array){
                return object['username'];
            }

            return new Promise((resolve, reject) => {
                let query =  modelUser.find({username: { $exists: true, $in: usernames }}, 'username');
                
                query.exec().then(data => {
                    if(data.empty()){
                        resolve(data);
                    }else{
                        reject(typeErrorResponse({name: 'UsernameExist'}));
                    }
                }).catch(error => {
                    reject(typeErrorResponse(error));
                });

            });
        }

        function createUsersDatabase(){
            
            function createUsers(resolve, reject){
                modelUser.create(usersData).then(data => {
                    console.log('criou!');
                    resolve({
                        header: {
                            'Location': `/users/:id`
                        },
                        body: data,
                        status: responseHand.statusCodes.success.created
                    })
                }).catch(error => {
                    reject(typeErrorResponse(error));
                });
            }

            return new Promise((resolve, reject) => {
                createUsers(resolve, reject);
            });
        }

        function typeErrorResponse(error){
            switch(error.name){
                case 'UsernameExist':
                    return {
                        body: {
                            name: "Duplicate resource",
                            description: "The request could not be completed due to a conflict with the current state of the target resource.",
                            message: "Username is exist."
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

        return Promise.all([this.connect(), checkUsernames(), createUsersDatabase()]).then(promises => {
            callback(promises[promises.lastIndex()]);

        }).catch(error => {
            callback(error);
            
        });
    }
    
    replaceUser(userID, userData, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error, null);
            }else{
                replaceUserDatabase();
            }
        });

        function replaceUserDatabase(){
            modelUser.findByIdAndUpdate(userID, userData, {
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
            mongoDB.connect().then(dataBase => {
                resolve(dataBase);

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