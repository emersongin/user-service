const mongoDB = require('../config/database');
const modelUser = require('./user');
const statusCode = require('../controller/status-code');

class UserService{

    getUser(userID, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback( error );
            }else{
                getUserDatabase();
            }
        });
    
        function getUserDatabase(){
            modelUser.findById(userID, function(error, resultData){
                if(error){
                    return callback({ data: error, status: statusCode.clientError.notFound}, null);
                }else if(!resultData){
                    return callback({ 
                        data: {
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
                        }, 
                        status: statusCode.clientError.notFound
                    }, null);
                }else{
                    return callback(null, resultData);
                }
            });
        }
    }
    
    createUser(userData, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error);
            }else{
                createUserDatabase();
            }
        });
    
        function createUserDatabase(){
            modelUser.create(userData, function(error, resultData){
                if(error){
                    return callback({data: error, status: statusCode.clientError.forbidden}, null);
                }else{
                    return callback(null, resultData);
                }
            });
        }
    }
    
    updateUser(userID, userData, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error);
            }else{
                updateUserDatabase();
            }
        });

        function updateUserDatabase(){
            modelUser.findByIdAndUpdate(userID, userData, function(error, resultData){
                if(error){
                    return callback({ data: error, status: statusCode.clientError.notFound}, null);
                }else if(!resultData){
                    return callback({ 
                        data: {
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
                        }, 
                        status: statusCode.clientError.notFound
                    }, null);
                }else{
                    return callback(null, resultData);
                }
            });
        }
    }
    
    deleteUser(userID, callback){
        mongoDB.connect(function(error, database){
            if(error){
                return callback(error);
            }else{
                deleteUserDatabase();
            }
        });

        function deleteUserDatabase(){
            modelUser.findByIdAndDelete(userID, function(error, resultData){
                if(error){
                    return callback({data: error, status: statusCode.clientError.notFound}, null);
                }else if(!resultData){
                    return callback({
                        data: {
                            name: "Not Found",
                            description: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
                            message: "check request param: id."
                        }, 
                        status: statusCode.clientError.notFound
                    }, null);
                }else{
                    return callback(null, resultData);
                }
            });
        }
    }
    
    disconnect(){
        return mongoDB.disconnect(() => {});
    }

}


module.exports = new UserService();