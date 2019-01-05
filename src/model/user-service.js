const mongoDB = require('../config/database');
const modelUser = require('./user');

function readUsers(){

}

function createUsers(users, callback){
    mongoDB.connect((err, database) => {
        modelUser.create(users, function (err, newUsers){
            if(err){
                return callback(err);
            }else{
                return callback(newUsers);
            }
        });
    });
}

function updateUsers(){

}

function deleteUsers(){

}

function disconnect(){
    return mongoDB.disconnect(() => {});
}

module.exports = { readUsers, createUsers, updateUsers, deleteUsers, disconnect };