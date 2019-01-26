class RequestHand{
    constructor(){
        this.headers = {
            contentType: {
                json: 'application/json',
                urlencoded: 'application/x-www-form-urlencoded'
            }
        }
    }
    cache(request){
        return request.fresh;
    }

    acceptHeaders(request, options){
        return !request.accepts(options);
    }

    contentTypeHeaders(request, options){
        return !request.is(options);
    }
}

module.exports = new RequestHand();