const responseController = require('./response-controller');
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

class RequestController{

    getUsers(request, response, next){
        let filter = request.body || {};

        if(requestHand.cacheHeaders(request)){
            return responseHand.end(response, responseHand.notModified("Fresh resource."));
        }

        responseController.getUsers(filter, function(data){      
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

        responseController.getUsers(filterUserID, function(data){
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

        responseController.createUsers(dataCreate, function(data){
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
        
        responseController.updateUsers(filterUserID, dataReplace, optionsReplace, function(data){
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
        
        responseController.updateUsers(filterParams, dataUpdate, optionsUpdateMultiple, function(data){
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
        
        responseController.updateUsers(filterUserID, dataUpdate, optionsUpdate, function(data){
            responseHand.end(response, data);
        });
    }

    deleteUsers(request, response, next){
        let filter = request.body || {};
    
        responseController.deleteUsers(filter, function(data){
            responseHand.end(response, data);
        });
    }

    deleteUserById(request, response, next){
        let filterUserID = {
            _id: request.params._id || ''
        };
    
        responseController.deleteUsers(filterUserID, function(data){
            responseHand.end(response, data);
        });''
    }

    optionsUsers(request, response, next){
        responseHand.end(response, {
            body: {
                get: {
                    getOne: {
                        cache: true,
                        params: "ID User",
                        body: false
                    },
                    getMany: {
                        cache: true,
                        params: false,
                        body: "Object {atributes for filter}",
                        warning: "Obect for filter null, get alls"
                    }
                },
                post: {
                    createOne: {
                        accepts: "JSON",
                        contentTypes: "URL-encoded and JSON",
                        params: false,
                        body: "Object {alls atributes for create}"
                    },
                    createMany: {
                        accepts: "JSON",
                        contentTypes: "URL-encoded and JSON",
                        params: false,
                        body: "Array[Object, Object]"
                    }
                },
                put: {
                    replaceOne: {
                        accepts: "JSON",
                        contentTypes: "URL-encoded and JSON",
                        params: "ID User",
                        body: "Object {alls atributes for replace}"
                    }
                },
                patch: {
                    updateOne: {
                        accepts: "JSON",
                        contentTypes: "URL-encoded and JSON",
                        params: "ID User",
                        body: "Object {atributes for updates}"
                    },
                    updateMany: {
                        accepts: "JSON",
                        contentTypes: "URL-encoded and JSON",
                        params: false,
                        body: "Object {filter:{atributes for filter}, data:{atributes for updates}}",
                        warning: "Object for filter null, update alls"
                    }
                },
                delete: {
                    deleteOne: {
                        params: "ID User",
                        body: false
                    },
                    deleteMany: {
                        params: false,
                        body: "Object {atributes for filter}",
                        warning: "Object for filter null, delete alls"
                    }
                }
            },
            status: responseHand.statusCodes.success.ok
        })
    }

    methodNotAllowed(request, response, next){
        return responseHand.end(response, responseHand.methodNotAllowed(request.method, "Use the OPTIONS verb for methods options."));
    }

}

module.exports = new RequestController();