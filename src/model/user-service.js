const mongoDB = require('../config/database');
const modelUser = require('./user');

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
                    return callback({ data: error, status: '404'}, null);
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
                    return callback({data: error, status: '403'}, null);
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
            modelUser.updateOne(userID, userData, function(error, resultData){
                if(error){
                    return callback({ data: error, status: '404'}, null);
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
            modelUser.deleteOne(userID, function(error, resultData){
                if(error){
                    return callback({ data: error, status: '404'}, null);
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