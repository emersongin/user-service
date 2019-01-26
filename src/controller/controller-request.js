const controllerResponse = require('./controller-response');
const requestHand = require('./request-hand');
const responseHand = require('./response-hand');

requestHand.rules({
    accepts: [
        requestHand.headers.contentType.json
    ],
    contentTypes: [
        requestHand.headers.contentType.json,
        requestHand.headers.contentType.urlencoded
    ]
});

class ControllerRequest{

    getUserById(request, response, next){
        let filterUserID = {
            _id: request.params._id || ''
        }

        if(requestHand.cacheHeaders(request)){
            return responseHand.notModified(response, "Fresh resource.");
        }

        controllerResponse.getUsers(filterUserID, async function(data){
            await responseHand.end(response, data);

            controllerResponse.disconnect();
        });
    }

    getUsers(request, response, next){
        let filter = request.body || {};

        if(requestHand.cacheHeaders(request)){
            return responseHand.notModified(response, "Fresh resource.");
        }

        controllerResponse.getUsers(filter, async function(data){
            await responseHand.end(response, data);
            
            controllerResponse.disconnect();
        });
    }
    
    createUsers(request, response, next){
        let usersData = request.body;

        if(requestHand.acceptHeaders(request)){
            return responseHand.notAcceptable(response, "Use Accept: " + requestHand.accepts + ".");
        }

        if(requestHand.contentTypeHeaders(request)){
            return responseHand.unsupportedMediaType(response, "Use Content-type: " + requestHand.contentTypes + ".");
        }

        controllerResponse.createUsers(usersData, async function(data){
            await responseHand.end(response, data);
            
            controllerResponse.disconnect();
        });
    }

    replaceUser(request, response, next){
        let userID = request.params._id || '';
        let username = request.body.username || '';
        let password = request.body.password || '';

        if(requestHand.acceptHeaders(request)){
            return responseHand.notAcceptable(response, "Use Accept: " + requestHand.accepts + ".");
        }
        
        if(requestHand.contentTypeHeaders(request)){
            return responseHand.unsupportedMediaType(response, "Use Content-type: " + requestHand.contentTypes + ".");
        }
        
        controllerResponse.replaceUser(userID, {username, password}, async function(data){
            await responseHand.end(response, data);
            
            controllerResponse.disconnect();
        });
    }

    updateUser(request, response, next){
        let userID = request.params._id || '';
        let userData = request.body;

        if(requestHand.acceptHeaders(request)){
            return responseHand.notAcceptable(response, "Use Accept: " + requestHand.accepts + ".");
        }
        
        if(requestHand.contentTypeHeaders(request)){
            return responseHand.unsupportedMediaType(response, "Use Content-type: " + requestHand.contentTypes + ".");
        }
        
        controllerResponse.updateUser(userID, userData, async function(data){
            await responseHand.end(response, data);
            
            controllerResponse.disconnect();
        });
    }

    deleteUser(request, response, next){
        let userID = request.params._id || '';
    
        controllerResponse.deleteUser(userID, async function(data){
            await responseHand.end(response, data);
            
            controllerResponse.disconnect();
        });
    }

    optionsUser(request, response, next){
        responseHand.end(response, {
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
        responseHand.methodNotAllowed(response, "Use the OPTIONS verb for methods options.");
    }

}

module.exports = new ControllerRequest();