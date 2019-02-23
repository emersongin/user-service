require('dotenv').load();
require('./config/core');

const Server = require('./config/server');
const userAPI = require('./api/user-api');

function startService(){
    Server.connect().then(expressServer =>{
        userAPI(expressServer);
    });
}

startService();