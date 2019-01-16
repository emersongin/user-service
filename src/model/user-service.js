const mongoDB = require('../config/database');
const modelUser = require('./user');
const responseHand = require('../controller/response-hand');

class UserService{

    getUser(userID, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error, null);
            }else{
                getUserDatabase();
            }

        });
    
        function getUserDatabase(){
            modelUser.findById(userID, function(error, data){
                if(error){
                    return callback({
                        body: error,
                        status: responseHand.statusCodes.clientError.badRequest
                    }, null);

                }else if(!data){
                    return callback({
                        body: {
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
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
    
    createUser(userData, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error, null);
            }else{
                createUserDatabase();
            }
        });
    
        function createUserDatabase(){
            modelUser.create(userData, function(error, data){
                if(error){
                    return typeErrorResponse(error);
                }else{
                    return callback(null, {
                        header: {
                            'Location': `/users/${data.id}`
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
    
    updateUser(userID, userData, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error, null);
            }else{
                updateUserDatabase();
            }
        });

        function updateUserDatabase(){
            modelUser.findByIdAndUpdate(userID, userData, function(error, data){
                if(error){
                    return callback({
                        body: error, 
                        status: responseHand.statusCodes.clientError.badRequest
                    }, null);

                }else if(!data){
                    return callback({
                        body: {
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
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
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
                        }, 
                        status: responseHand.statusCodes.clientError.notFound
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