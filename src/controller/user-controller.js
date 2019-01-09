const userModel = require('../model/user');
const userService = require('../model/user-service');
const statusCode = require('./status-code');

class UserController{

    getUser(request, response, next){
        let userID = request.params._id || '';
    
        userService.getUser(userID, function(error, resultData){
            if(error){
                responseError(error.status);
            }else{
                response.status(statusCode.success.ok)
                    .json(resultData);
            }
    
            function responseError(errorStatus){
                switch(errorStatus){
                    case 500:
                        response.status(statusCode.serverError.internalServerError)
                            .json(error.data);
                    case 404:
                        response.status(statusCode.clientError.notFound)
                            .json(error.data);
                }
            }
    
            userService.disconnect();
        });
    }
    
    createUser(request, response, next){
        let username = request.body.username || '';
        let password = request.body.password || '';
    
        const userData = userModel({username, password});
    
        userService.createUser(userData, function(error, resultData){
            if(error){
                responseError(error.status);
            }else{
                response.header('Location', '/users/' + resultData.id)
                    .status(statusCode.success.created)
                    .json(resultData);
            }
    
            function responseError(errorStatus){
                switch(errorStatus){
                    case 500:
                        response.status(statusCode.serverError.internalServerError)
                            .json(error.data);
                    case 403:
                        response.status(statusCode.clientError.forbidden)
                            .json(error.data);
                }
            }
    
            userService.disconnect();
        });
    }

    updateUser(request, response, next){
        let userID = request.params._id || '';
        let username = request.body.username || '';
        let password = request.body.password || '';
        
        userService.updateUser(userID, {username, password}, function(error, resultData){
            if(error){
                responseError(error.status);
            }else{
                response.status(statusCode.success.ok)
                    .json(resultData);
            }
    
            function responseError(errorStatus){
                switch(errorStatus){
                    case 500:
                        response.status(statusCode.serverError.internalServerError)
                            .json(error.data);
                    case 404:
                        response.status(statusCode.clientError.notFound)
                            .json(error.data);
                }
            }
    
            userService.disconnect();
        });
    }

    deleteUser(request, response, next){
        let userID = request.params._id || '';
    
        userService.deleteUser(userID, function(error, resultData){
            if(error){
                responseError(error.status);
            }else{
                response.status(statusCode.success.ok)
                    .json(resultData);
            }
    
            function responseError(errorStatus){
                switch(errorStatus){
                    case 500:
                        response.status(statusCode.serverError.internalServerError)
                            .json(error.data);
                    case 404:
                        response.status(statusCode.clientError.notFound)
                            .json(error.data);
                }
            }
    
            userService.disconnect();
        });
    }

    optionsUser(request, response, next){
        response.status(statusCode.success.ok)
        .json({
            get: {
                params: {
                    _id: '_id, user database'
                }
            },
            post: {
                username: {
                    type: 'String',
                },
                password: {
                    type: 'String',
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
        });
    }
}


module.exports = new UserController();