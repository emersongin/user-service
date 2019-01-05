const userModel = require('../model/user');
const userService = require('../model/user-service');

module.exports = function(expressServer){

    expressServer.post('/users', function(request, response, next){
        let username = request.body.username || '';
        let password = request.body.password || '';

        const createUser = userModel( { username, password });

        userService.createUsers(createUser, function(newUser){
            response.header('Location', '/users/' + newUser.id).status(201).json( { newUser });
            userService.disconnect();
        });
    });
}