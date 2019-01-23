const mongoDB = require('../config/database');
const modelUser = require('./user');
const responseHand = require('../controller/response-hand');

class UserService{

    getUsers(filter, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error, null);
            }else{
                getUsersDatabase();
            }

        });
    
        function getUsersDatabase(){
            modelUser.find(filter, function(error, data){
                if(error){
                    return callback({
                        body: error,
                        status: responseHand.statusCodes.clientError.badRequest
                    }, null);

                }else if(!data || data.length <= 0){
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
                        status: responseHand.statusCodes.success.ok,
                        body: data.map(responseHand.createLinksGet)
                    });

                }
            });
        }
    }
    
    createUsers(usersData, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error, null);
                
            }else{
                checkUsernames();
            }
        });
    
        function checkUsernames(){
            let usernames;

            function mapUsernames(object, index, array){
                return object['username'];
            }

            if(Array.isArray(usersData)){
                usernames = usersData.map(mapUsernames);
            }else{
                usernames = usersData.username;
            }
            
            modelUser.findOne({username: { $in: usernames }}, 'username', function(error, data){
                if(error){
                    return typeErrorResponse(error);

                }else if(data){
                    return callback({
                        body: {
                            name: "Duplicate resource",
                            description: "The request could not be completed due to a conflict with the current state of the target resource.",
                            message: "Username is exist.",
                            username: data.username
                        }, 
                        status: responseHand.statusCodes.clientError.conflict
                    }, null);

                }else{
                    createUsersDatabase();

                }
            });
        }

        function createUsersDatabase(){
            modelUser.create(usersData, function(error, data){
                if(error){
                    return typeErrorResponse(error);

                }else{
                    return callback(null, {
                        header: {
                            'Location': `/users/:id`
                        },
                        body: data,
                        status: responseHand.statusCodes.success.created
                    });

                }
            });
        }

        function typeErrorResponse(error){
            switch(error.name){
                case 'ValidationError':
                    callback({
                        body: error,
                        status: responseHand.statusCodes.clientError.forbidden
                    }, null);
                    break;
                default :
                    callback({
                        body: error,
                        status: responseHand.statusCodes.clientError.badRequest
                    }, null);
            }
        }
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
    
    disconnect(){
        return mongoDB.disconnect(() => {});
    }

}


module.exports = new UserService();