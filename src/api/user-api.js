const expressModule = require('express');

module.exports = function(expressServer){
    const userAPI = expressModule.Router();
    const controllerRequest = require('../controller/controller-request');

    function loadRoutes(){
        userRoutes();
    }

    function userRoutes(){
        expressServer.use('/api', userAPI);
        userServices();
    }

    function userServices(){
        userAPI.route('/v0/users')
            .get(controllerRequest.getUsers)
            .post(controllerRequest.createUsers)
            .patch(controllerRequest.updateUsers)

            .options(controllerRequest.optionsUser)
            .all(controllerRequest.methodNotAllowed);

        userAPI.route('/v0/users/:_id')
            .get(controllerRequest.getUserById)
            .put(controllerRequest.replaceUserById)
            .patch(controllerRequest.updateUserById)

            .delete(controllerRequest.deleteUser)
            .options(controllerRequest.optionsUser)
            .all(controllerRequest.methodNotAllowed);
    }
    
    loadRoutes();
}