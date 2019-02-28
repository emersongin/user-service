require('dotenv').load();
require('./config/core');

const server = require('./config/server');

function startService(){
    server.express.listen(server.port, function createServerHTTP(){
        console.log(`SERVER is running in port: ${this._connectionKey}`);
    });
}

startService();