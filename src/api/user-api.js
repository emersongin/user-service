const expressModule = require('express');

module.exports = function(expressServer){
    const userAPI = expressModule.Router();
    const userModel = require('../model/user');
    const userService = require('../model/user-service');

    function loadRoutes(){
        userRoutes();
    }

    function userRoutes(){
        expressServer.use('/api', userAPI);
        userServices();
    }

    function userServices(){
        userAPI.get('/v0/users/:id', getUser);
        userAPI.post('/v0/users', createUser);
    }
    
    loadRoutes();

    function getUser(request, response, next){
        let userID = request.params.id || '';

        userService.readUser(userID, function(error, resultData){
            if(error){
                responseError(error.status);
            }else{
                response.status(200)
                .json( resultData );
            }

            function responseError(errorStatus){
                switch(errorStatus){
                    case '500':
                        response.status(500)
                            .json( error.data );
                    case '403':
                        response.status(404)
                            .json( error.data );
                }
            }

            userService.disconnect();
        });
    }

    function createUser(request, response, next){
        let username = request.body.username || '';
        let password = request.body.password || '';

        const userData = userModel( { username, password } );

        userService.createUser(userData, function(error, resultData){
            if(error){
                responseError(error.status);
            }else{
                response.header('Location', '/users/' + resultData.id)
                .status(201)
                .json( resultData );
            }

            function responseError(errorStatus){
                switch(errorStatus){
                    case '500':
                        response.status(500)
                            .json( error.data );
                    case '403':
                        response.status(403)
                            .json( error.data );
                }
            }

            userService.disconnect();
        });
    }
}