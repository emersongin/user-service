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
        userAPI.get('/v0/users/:_id', userController.getUser);
        userAPI.post('/v0/users', userController.createUser);
        userAPI.put('/v0/users/:_id', userController.updateUser);
        userAPI.delete('/v0/users/:_id', userController.deleteUser);
    }
    
    loadRoutes();
}