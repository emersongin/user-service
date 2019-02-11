class RequestHand{
    constructor(){
        this.headers = {
            contentType: {
                json: 'application/json',
                urlencoded: 'application/x-www-form-urlencoded'
            }
        };

        this.accepts = null;
        this.contentType = null;
    }

    rules(options){
        this.accepts = options.accepts;
        this.contentTypes = options.contentTypes;
    }

    cacheHeaders(request){
        return request.fresh;
    }

    acceptHeaders(request){
        return !request.accepts(this.accepts);
    }

    contentTypeHeaders(request){
        return !request.is(this.contentTypes);
    }
}

module.exports = new RequestHand();