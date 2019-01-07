const userModel = require('../model/user');
const userService = require('../model/user-service');

function getUser(request, response, next){
    let userID = request.params._id || '';

    userService.getUser(userID, function(error, resultData){
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
                case '404':
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

module.exports = { getUser, createUser };