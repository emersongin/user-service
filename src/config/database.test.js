const test = require('tape');
const connectionDatabase = require('./database');

function runTests(){
    test('MongoDB Connection', tape => {
        connectionDatabase.connect().then(connection => {
            tape.assert(connection, "Connection established.");
            tape.end()
        }).catch(error => {
            tape.assert(error, "Error connection DB.");
            tape.end()
        })
    })
 
    test('MongoDB Disconnection', tape => {
        connectionDatabase.disconnect().then(disconnection => {
            tape.assert(disconnection, "Disconnected.");
            tape.end()
        }).catch(error => {
            tape.assert(error, "Error disconnected DB.");
            tape.end()
        })
    })
}

module.exports = runTests;