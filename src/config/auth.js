const jsonWebToken = require('jsonwebtoken');
const responseHand = require('../controllers/response-hand');

module.exports = (request, response, next) => {
    const tokenValidate = request.body.token || request.header('authorization');
    
    if(request.method === 'OPTIONS'){
        next();
    }

    if(!tokenValidate){
        return responseHand.end(response, responseHand.forbidden('Token no provided!'));
    }

    async function verifyToken(){
        try{
            const tokenDecoded = await jsonWebToken.verify(tokenValidate, process.env.AUTH_SECRET);

            next();
        }catch(error){
            return responseHand.end(response, responseHand.forbidden('Failed to authenticate token!'));
        }
    }
    
    verifyToken();
};