const mongoDB = require('../config/database');
const modelUser = require('../models/user');
const responseHand = require('./response-hand');

class ResponseController{

    async getUsers(filter, callback){   
        try{
            await mongoDB.connect();
            const usersFound = await getUsersDatabase();

            callback(usersFound);
        }catch(error){
            callback(error);
        }finally{
            await mongoDB.disconnect();
        }

        function getUsersDatabase(){
            return new Promise(async function(resolve, reject){
                try{
                    const queryData = await modelUser.find(filter).exec();

                    if(queryData.empty()){
                        return reject(responseHand.notFound("Check the request parameter; :id."));
                    }else{
                        return resolve(responseHand.ok(queryData.map(responseHand.createLinks)));
                    }
                }catch(error){
                    return reject(responseHand.badRequest(error));
                }
            });
        }
    }
    
    async createUsers(dataCreate, callback){
        try{
            await mongoDB.connect();
            const usernames = await checkUsernames();
            const usersCreated = await createUsersDatabase();

            callback(usersCreated);       
        }catch(error){
            callback(error);
        }finally{
            await mongoDB.disconnect();
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
                            data: queryData
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

                    return resolve(responseHand.created(createdUsers.map(responseHand.createLinks)));
                }catch(error){
                    return reject(errorResponse(error));
                }
            });
        }

        function errorResponse(error){
            switch(error.name){
                case 'UsernamesExists':
                    return responseHand.conflict(error.data, "Usernames is exists.");
                break;
                case 'ValidationError':
                    return responseHand.forbidden(error);
                break;
                default :
                    return responseHand.badRequest(error);
            }
        } 
    }
    
    async updateUsers(filter, dataUpdate, optios, callback){
        try{
            await mongoDB.connect();
            const usersUpdated = await updateUsersDatabase();

            callback(usersUpdated);
        }catch(error){
            callback(error);
        }finally{
            await mongoDB.disconnect();
        }

        function updateUsersDatabase(){
            return new Promise(async function(resolve, reject){                
                try{
                    const queryData = await modelUser.update(filter, dataUpdate, optios);

                    if(queryData.ok && queryData.nModified){
                        return resolve(responseHand.ok(queryData));
                    }else{
                        return reject(responseHand.notFound("Check the request parameter; :id."));
                    }
                }catch(error){
                    return reject(responseHand.badRequest(error));
                }
            });
        }
    }
    
    async deleteUsers(filter, callback){
        try{
            await mongoDB.connect();
            const usersDeleted = await deleteUsersDatabase();

            callback(usersDeleted);
        }catch(error){
            callback(error);
        }finally{
            await mongoDB.disconnect();
        }

        function deleteUsersDatabase(){
            return new Promise(async function(resolve, reject){
                try{
                    const queryData = await modelUser.remove(filter).exec();

                    if(queryData.ok && queryData.n){
                        return resolve(responseHand.noContent(queryData));
                    }else{
                        return reject(responseHand.gone("Check the request parameter; :id."));
                    }
                }catch(error){
                    return reject(responseHand.badRequest(error));
                }
            });
        }
    }

}

module.exports = new ResponseController();