const expressModule = require('express');

module.exports = function(expressServer){
    const userAPI = expressModule.Router();
    const userController = require('../controller/user-controller');

    function loadRoutes(){
        userRoutes();
    }

    function userRoutes(){
        expressServer.use('/api', userAPI);
        userServices();
    }

    function userServices(){
        userAPI.route('/v0/users')
            .post(userController.createUser)
            .options(userController.optionsUser)
            .all(userController.methodNotAllowed);

        userAPI.route('/v0/users/:_id')
            .get(userController.getUser)
            .put(userController.replaceUser)
            .patch(userController.updateUser)
            .delete(userController.deleteUser)
            .options(userController.optionsUser)
            .all(userController.methodNotAllowed);
    }
    
    loadRoutes();
}