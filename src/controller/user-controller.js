const userModel = require('../model/user');
const userService = require('../model/user-service');
const responseHand = require('./response-hand');

class UserController{

    getUser(request, response, next){
        let userID = request.params._id || '';

        userService.getUser(userID, function(error, data){
            if(error){
                responseHand.failed(request, response, next, error);
            }else{
                responseHand.success(request, response, next, data);
            }

            userService.disconnect();
        });
    }
    
    createUser(request, response, next){
        let username = request.body.username || '';
        let password = request.body.password || '';
        
        const userData = userModel({username, password});

        if(!request.is(['application/json', 'application/x-www-form-urlencoded'])){
            return responseHand.failed(request, response, next, {
                body: {
                    name: "MIME type unsupported",
                    description: "The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.",
                    message: "Use Content-type: application/json or application/x-www-form-urlencoded."
                },
                status: responseHand.statusCodes.clientError.unsupportedMediaType
            });
        }

        userService.createUser(userData, function(error, data){
            if(error){
                responseHand.failed(request, response, next, error);
            }else{
                responseHand.success(request, response, next, data);
            }

            userService.disconnect();
        });
    }

    updateUser(request, response, next){
        let userID = request.params._id || '';
        let username = request.body.username || '';
        let password = request.body.password || '';

        if(!request.is(['application/json', 'application/x-www-form-urlencoded'])){
            return responseHand.failed({
                body: {
                    name: "MIME type unsupported",
                    description: "The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.",
                    message: "Use Content-type: application/json or application/x-www-form-urlencoded."
                },
                status: responseHand.statusCodes.clientError.unsupportedMediaType
            });
        }
        
        userService.updateUser(userID, {username, password}, function(error, data){
            if(error){
                responseHand.failed(request, response, next, error);
            }else{
                responseHand.success(request, response, next, data);
            }
        
            userService.disconnect();
        });
    }

    deleteUser(request, response, next){
        let userID = request.params._id || '';
    
        userService.deleteUser(userID, function(error, data){
            if(error){
                responseHand.failed(request, response, next, error);
            }else{
                responseHand.success(request, response, next, data);
            }
        
            userService.disconnect();
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
        responseHand.failed(request, response, next, {
            body: {
                name: "Method not allowed",
                description: `Method ${request.method} received in the request-line is known by the origin server but not supported by the target resource.`,
                message: "user the OPTIONS verb for method options."
            },
            status: responseHand.statusCodes.clientError.methodNotAllowed
        });
    }

}

module.exports = new UserController();