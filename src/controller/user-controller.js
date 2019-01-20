const userModel = require('../model/user');
const userService = require('../model/user-service');
const responseHand = require('./response-hand');

class UserController{

    getUsers(request, response, next){
        if(request.fresh){
            return responseHand.notModified(request, response, next, "Fresh resource.");
        }

        userService.getUsers(function(error, data){
            try{
                responseHand.success(request, response, next, data);
            }catch{
                responseHand.failed(request, response, next, error);

            }finally{
                userService.disconnect();
            }
        });
    }

    getUser(request, response, next){
        let userID = request.params._id || '';

        if(request.fresh){
            return responseHand.notModified(request, response, next, "Fresh resource.");
        }

        userService.getUser(userID, function(error, data){
            try{
                responseHand.success(request, response, next, data);
            }catch{
                responseHand.failed(request, response, next, error);

            }finally{
                userService.disconnect();
            }
        });
    }
    
    createUser(request, response, next){
        let username = request.body.username || '';
        let password = request.body.password || '';
        
        const userData = userModel({username, password});

        if(!request.accepts(['application/json'])){
            return responseHand.notAcceptable(request, response, next, "Use Accept: application/json.");
        }

        if(!request.is(['application/json', 'application/x-www-form-urlencoded'])){
            return responseHand.unsupportedMediaType(request, response, next, 
                "Use Content-type: application/json or application/x-www-form-urlencoded.");
        }

        userService.createUser(userData, function(error, data){
            try{
                responseHand.success(request, response, next, data);
            }catch{
                responseHand.failed(request, response, next, error);

            }finally{
                userService.disconnect();
            }
        });
    }

    replaceUser(request, response, next){
        let userID = request.params._id || '';
        let username = request.body.username || '';
        let password = request.body.password || '';

        if(!request.accepts(['application/json'])){
            return responseHand.notAcceptable(request, response, next, "Use Accept: application/json.");
        }
        
        if(!request.is(['application/json', 'application/x-www-form-urlencoded'])){
            return responseHand.unsupportedMediaType(request, response, next, 
                "Use Content-type: application/json or application/x-www-form-urlencoded.");
        }
        
        userService.replaceUser(userID, {username, password}, function(error, data){
            try{
                responseHand.success(request, response, next, data);
            }catch{
                responseHand.failed(request, response, next, error);

            }finally{
                userService.disconnect();
            }
        });
    }

    updateUser(request, response, next){
        let userID = request.params._id || '';
        let userData = request.body;

        if(!request.accepts(['application/json'])){
            return responseHand.notAcceptable(request, response, next, "Use Accept: application/json.");
        }
        
        if(!request.is(['application/json', 'application/x-www-form-urlencoded'])){
            return responseHand.unsupportedMediaType(request, response, next, 
                "Use Content-type: application/json or application/x-www-form-urlencoded.");
        }
        
        userService.updateUser(userID, userData, function(error, data){
            try{
                responseHand.success(request, response, next, data);
            }catch{
                responseHand.failed(request, response, next, error);

            }finally{
                userService.disconnect();
            }
        });
    }

    deleteUser(request, response, next){
        let userID = request.params._id || '';
    
        userService.deleteUser(userID, function(error, data){
            try{
                responseHand.success(request, response, next, data);
            }catch{
                responseHand.failed(request, response, next, error);
                
            }finally{
                userService.disconnect();
            }
        });
    }

    optionsUser(request, response, next){
        responseHand.success(request, response, next, {
            body: {
                get: {
                    params: {
                        _id: '_id, user database'
                    }
                },
                post: {
                    body: {
                        username: {
                            type: 'String',
                        },
                        password: {
                            type: 'String',
                        }
                    }
                },
                put: {
                    params: {
                        _id: '_id, user database'
                    },
                    body: {
                        username: {
                            type: 'String',
                        },
                        password: {
                            type: 'String',
                        }
                    }
                },
                delete: {
                    params: {
                        _id: '_id, user databese'
                    }
                } 
            },
            status: responseHand.statusCodes.success.ok
        })
    }

    methodNotAllowed(request, response, next){
        responseHand.methodNotAllowed(request, response, next, "Use the OPTIONS verb for methods options.");
    }

}

module.exports = new UserController();