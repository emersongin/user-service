const mongoDB = require('../config/database');
const modelUser = require('./user');
const responseHTTP = require('../controller/response-http');

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
            modelUser.findById(userID, function(error, result){
                if(error){
                    return callback({
                        data: error,
                        status: responseHTTP.statusCodes.clientError.badRequest
                    }, null);

                }else if(!result){
                    return callback({ 
                        data: {
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
                        }, 
                        status: responseHTTP.statusCodes.clientError.notFound
                    }, null);

                }else{
                    return callback(null, {
                        data: result,
                        status: responseHTTP.statusCodes.success.ok
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
            modelUser.create(userData, function(error, result){
                if(error){
                    return typeErrorResponse(error);
                }else{
                    return callback(null, {
                        data: result,
                        status: responseHTTP.statusCodes.success.created
                    });
                }
            });
        }

        function typeErrorResponse(error){
            switch(error.name){
                case 'ValidationError':
                    callback({
                        data: error,
                        status: responseHTTP.statusCodes.clientError.forbidden
                    }, null);
                    break;
                default :
                    callback({
                        data: error,
                        status: responseHTTP.statusCodes.clientError.badRequest
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
            modelUser.findByIdAndUpdate(userID, userData, function(error, result){
                if(error){
                    return callback({
                        data: error, 
                        status: responseHTTP.statusCodes.clientError.badRequest
                    }, null);

                }else if(!result){
                    return callback({
                        data: {
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
                        }, 
                        status: responseHTTP.statusCodes.clientError.notFound
                    }, null);

                }else{
                    return callback(null, {
                        data: result,
                        status: responseHTTP.statusCodes.success.ok
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
            modelUser.findByIdAndDelete(userID, function(error, result){
                if(error){
                    return callback({
                        data: error, 
                        status: responseHTTP.statusCodes.clientError.badRequest
                    }, null);

                }else if(!result){
                    return callback({
                        data: {
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
                        }, 
                        status: responseHTTP.statusCodes.clientError.notFound
                    }, null);

                }else{
                    return callback(null, {
                        data: result,
                        status: responseHTTP.statusCodes.success.noContent
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