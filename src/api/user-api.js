const expressModule = require('express');
const authToken = require('../config/auth');
const requestController = require('../controllers/request-controller');

module.exports = function(expressServer){
    const userAPI = expressModule.Router();
    const userAuth = expressModule.Router();

    function loadRoutes(){
        userRoutes();
    }

    function userRoutes(){
        expressServer.use('/api', userAPI);
        expressServer.use('/auth', userAuth);

        userAPIServices();
        userAuthServices();
    }

    function userAuthServices(){
        userAuth.route('/v0/users')
        .post(requestController.authenticateToken)
        .all(requestController.methodNotAllowed);
    };

    function userAPIServices(){
        userAPI.use(authToken);

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