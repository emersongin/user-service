const expressModule = require('express');
const requestController = require('../controllers/request-controller');

module.exports = function(expressServer){
    const userAPI = expressModule.Router();

    function loadRoutes(){
        userRoutes();
    }

    function userRoutes(){
        expressServer.use('/api', userAPI);
        userServices();
    }

    function userServices(){
        userAPI.route('/v0/users')
            .get(requestController.getUsers)
            .post(requestController.createUsers)
            .patch(requestController.updateUsers)
            .delete(requestController.deleteUsers)
            .options(requestController.optionsUsers)
            .all(requestController.methodNotAllowed);

        userAPI.route('/v0/users/:_id')
            .get(requestController.getUserById)
            .put(requestController.replaceUserById)
            .patch(requestController.updateUserById)
            .delete(requestController.deleteUserById)
            .options(requestController.optionsUsers)
            .all(requestController.methodNotAllowed);
    }
    
    loadRoutes();
}