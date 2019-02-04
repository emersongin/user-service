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

    getUsers(request, response, next){
        let filter = request.body || {};

        if(requestHand.cacheHeaders(request)){
            return responseHand.end(response, responseHand.notModified("Fresh resource."));
        }

        controllerResponse.getUsers(filter, function(data){
            responseHand.end(response, data);
        });
    }
    
    getUserById(request, response, next){
        let filterUserID = {
            _id: request.params._id || ''
        };

        if(requestHand.cacheHeaders(request)){
            return responseHand.end(response, responseHand.notModified("Fresh resource."));
        }

        controllerResponse.getUsers(filterUserID, function(data){
            responseHand.end(response, data);
        });
    }

    createUsers(request, response, next){
        let dataCreate = request.body || {};

        if(requestHand.acceptHeaders(request)){
            return responseHand.end(response, responseHand.notAcceptable("Use Accept: " + requestHand.accepts + "."));
        }

        if(requestHand.contentTypeHeaders(request)){
            return responseHand.end(response, responseHand.unsupportedMediaType("Use Content-type: " + requestHand.contentTypes + "."));
        }

        controllerResponse.createUsers(dataCreate, function(data){
            responseHand.end(response, data);
        });
    }

    replaceUserById(request, response, next){
        let filterUserID = {
            _id: request.params._id || ''
        };
        let dataReplace = request.body || {};

        let optionsReplace = {
            overwrite: true,
            multi: false,
            runValidators: true
        }

        if(requestHand.acceptHeaders(request)){
            return responseHand.end(response, responseHand.notAcceptable("Use Accept: " + requestHand.accepts + "."));
        }
        
        if(requestHand.contentTypeHeaders(request)){
            return responseHand.end(response, responseHand.unsupportedMediaType("Use Content-type: " + requestHand.contentTypes + "."));
        }
        
        controllerResponse.updateUsers(filterUserID, dataReplace, optionsReplace, function(data){
            responseHand.end(response, data);
        });
    }

    updateUsers(request, response, next){
        let filterParams = request.body.filter;
        let dataUpdate = {$set: request.body.data} || {};

        let optionsUpdateMultiple = {
            overwrite: false,
            multi: true,
            runValidators: false
        }

        if(requestHand.acceptHeaders(request)){
            return responseHand.end(response, responseHand.notAcceptable("Use Accept: " + requestHand.accepts + "."));
        }
        
        if(requestHand.contentTypeHeaders(request)){
            return responseHand.end(response, responseHand.unsupportedMediaType("Use Content-type: " + requestHand.contentTypes + "."));
        }
        
        controllerResponse.updateUsers(filterParams, dataUpdate, optionsUpdateMultiple, function(data){
            responseHand.end(response, data);
        });
    }

    updateUserById(request, response, next){
        let filterUserID = {
            _id: request.params._id || ''
        };
        let dataUpdate = {$set: request.body} || {};
        
        let optionsUpdate = {
            overwrite: false,
            multi: false,
            runValidators: false
        };

        if(requestHand.acceptHeaders(request)){
            return responseHand.end(response, responseHand.notAcceptable("Use Accept: " + requestHand.accepts + "."));
        }
        
        if(requestHand.contentTypeHeaders(request)){
            return responseHand.end(response, responseHand.unsupportedMediaType("Use Content-type: " + requestHand.contentTypes + "."));
        }
        
        controllerResponse.updateUsers(filterUserID, dataUpdate, optionsUpdate, function(data){
            responseHand.end(response, data);
        });
    }

    deleteUsers(request, response, next){
        let filter = request.body || {};
    
        controllerResponse.deleteUsers(filter, function(data){
            responseHand.end(response, data);
        });
    }

    deleteUserById(request, response, next){
        let filterUserID = request.params._id || '';
    
        controllerResponse.deleteUsers(filterUserID, function(data){
            responseHand.end(response, data);
        });
    }

    optionsUsers(request, response, next){
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
        return responseHand.end(response, responseHand.methodNotAllowed("Use the OPTIONS verb for methods options."));
    }

}

module.exports = new ControllerRequest();