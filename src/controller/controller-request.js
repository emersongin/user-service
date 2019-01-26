const controllerResponse = require('./controller-response');
const responseHand = require('./response-hand');

class UserController{

    getUserById(request, response, next){
        let filterUserID = {
            _id: request.params._id || ''
        }

        if(request.fresh){
            return responseHand.notModified(request, response, next, "Fresh resource.");
        }

        controllerResponse.getUsers(filterUserID, async function(data){
            await responseHand.end(request, response, next, data);

            controllerResponse.disconnect();
        });
    }

    getUsers(request, response, next){
        let filter = request.body || {};

        if(request.fresh){
            return responseHand.notModified(request, response, next, "Fresh resource.");
        }

        controllerResponse.getUsers(filter, async function(data){
            await responseHand.end(request, response, next, data);
            
            controllerResponse.disconnect();
        });
    }
    
    createUsers(request, response, next){
        const usersData = request.body;

        if(!request.accepts(['application/json'])){
            return responseHand.notAcceptable(request, response, next, "Use Accept: application/json.");
        }

        if(!request.is(['application/json', 'application/x-www-form-urlencoded'])){
            return responseHand.unsupportedMediaType(request, response, next, 
                "Use Content-type: application/json or application/x-www-form-urlencoded.");
        }

        controllerResponse.createUsers(usersData, async function(data){
            await responseHand.end(request, response, next, data);
            
            controllerResponse.disconnect();
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
        
        controllerResponse.replaceUser(userID, {username, password}, async function(data){
            await responseHand.end(request, response, next, data);
            
            controllerResponse.disconnect();
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
        
        controllerResponse.updateUser(userID, userData, async function(data){
            await responseHand.end(request, response, next, data);
            
            controllerResponse.disconnect();
        });
    }

    deleteUser(request, response, next){
        let userID = request.params._id || '';
    
        controllerResponse.deleteUser(userID, async function(data){
            await responseHand.end(request, response, next, data);
            
            controllerResponse.disconnect();
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