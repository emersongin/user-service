const mongoDB = require('../config/database');
const modelUser = require('./user');

function readUser(userID, callback){
    mongoDB.connect(function(error, database){
        if(error){
            return callback( error );
        }else{
            readUserDatabase();
        }
    });

    function readUserDatabase(){
        modelUser.findById(userID, function(error, resultData){
            if(error){
                return callback( { data: error, status: '404'}, null);
            }else{
                return callback( null, resultData);
            }
        });
    }
}

function createUser(userData, callback){
    mongoDB.connect(function(error, database){
        if(error){
            return callback( error );
        }else{
            createUserDatabase();
        }
    });

    function createUserDatabase(){
        modelUser.create(userData, function(error, resultData){
            if(error){
                return callback( { data: error, status: '403'}, null);
            }else{
                return callback( null, resultData);
            }
        });
    }
}

function updateUser(){

}

function deleteUser(){

}

function disconnect(){
    return mongoDB.disconnect(() => {});
}

module.exports = { readUser, createUser, disconnect };