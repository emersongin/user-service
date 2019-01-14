const userModel = require('../model/user');
const userService = require('../model/user-service');
const statusCode = require('./status-code');

class UserController{

    getUser(request, response, next){
        let userID = request.params._id || '';

        userService.getUser(userID, function(error, resultData){
            if(error){
                responseError(error);
            }else{
                response.status(statusCode.success.ok)
                        .json(resultData);
            }

            userService.disconnect();
        });

        function responseError(error){
            switch(error.status){
                case 500:
                    response.status(statusCode.serverError.internalServerError)
                            .json(error.data);
                case 404:
                    response.status(statusCode.clientError.notFound)
                            .json(error.data);
            }
        }
    }
    
    createUser(request, response, next){
        let username = request.body.username || '';
        let password = request.body.password || '';

        const userData = userModel({username, password});

        if(!request.is(['application/json', 'application/x-www-form-urlencoded'])){
            responseError({
                data: {
                    name: "MIME type unsupported",
                    description: "The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.",
                    message: "Use Content-type: application/json or application/x-www-form-urlencoded."
                },
                status: statusCode.clientError.unsupportedMediaType
            });
        }

        userService.createUser(userData, function(error, resultData){
            if(error){
                responseError(error);
            }else{
                response.header('Location', '/users/' + resultData.id)
                        .status(statusCode.success.created)
                        .json(resultData);
            }

            userService.disconnect();
        });

        function responseError(error){
            switch(error.status){
                case 500:
                    response.status(statusCode.serverError.internalServerError)
                            .json(error.data);
                case 415:
                    response.status(statusCode.clientError.unsupportedMediaType)
                            .json(error.data);
                case 403:
                    response.status(statusCode.clientError.forbidden)
                            .json(error.data);
            }
        }
    }

    updateUser(request, response, next){
        let userID = request.params._id || '';
        let username = request.body.username || '';
        let password = request.body.password || '';

        if(!request.is(['application/json', 'application/x-www-form-urlencoded'])){
            responseError({
                data: {
                    name: "MIME type unsupported",
                    description: "The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.",
                    message: "Use Content-type: application/json or application/x-www-form-urlencoded."
                },
                status: statusCode.clientError.unsupportedMediaType
            });
        }
        
        userService.updateUser(userID, {username, password}, function(error, resultData){
            if(error){
                responseError(error);
            }else{
                response.status(statusCode.success.ok)
                        .json(resultData);
            }
        
            userService.disconnect();
        });

        function responseError(error){
            switch(error.status){
                case 500:
                    response.status(statusCode.serverError.internalServerError)
                            .json(error.data);
                case 415:
                    response.status(statusCode.clientError.unsupportedMediaType)
                            .json(error.data);
                case 404:
                    response.status(statusCode.clientError.notFound)
                            .json(error.data);
            }
        }
    }

    deleteUser(request, response, next){
        let userID = request.params._id || '';
    
        userService.deleteUser(userID, function(error, resultData){
            if(error){
                responseError(error);
            }else{
                response.status(statusCode.success.noContent)
                        .json(resultData);;
            }
        
            userService.disconnect();
        });

        function responseError(error){
            switch(error.status){
                case 500:
                    response.status(statusCode.serverError.internalServerError)
                            .json(error.data);
                case 404:
                    response.status(statusCode.clientError.notFound)
                            .json(error.data);
            }
        }
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
                });
    }

    methodNotAllowed(request, response, next){
        response.status(statusCode.clientError.methodNotAllowed)
                .json({
                    name: "Method not allowed",
                    description: `Method ${request.method} received in the request-line is known by the origin server but not supported by the target resource.`,
                    message: "user the OPTIONS verb for method options."
                });
    }

}

module.exports = new UserController();