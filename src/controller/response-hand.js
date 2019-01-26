class ResponseHand{
    constructor(){
        this.statusCodes = {
            informational: {
                continue: 100,
                switchingProtocols: 101,
                processing: 102
            },
            success: {
                ok: 200,
                created: 201,
                accepted: 202,
                nonAuthoritativeInformation: 203,
                noContent: 204,
                resetContent: 205,
                partialContent: 206,
                multiStatus: 207,
                alreadyReported: 208,
                imUsed: 226
            },
            redirection: {
                multipleChoices: 300,
                movedPermanently: 301,
                found: 302,
                seeOther: 303,
                notModified: 304,
                useProxy: 305,
                temporaryRedirect: 307,
                permanentRedirect: 308
            },
            clientError: {
                badRequest: 400,
                unauthorized: 401,
                paymentRequired: 402,
                forbidden: 403,
                notFound: 404,
                methodNotAllowed: 405,
                notAcceptable: 406,
                proxyAuthenticationRequired: 407,
                requestTimeout: 408,
                conflict: 409,
                gone: 410,
                lengthRequired: 411,
                preconditionFailed: 412,
                payloadTooLarge: 413,
                uriTooLong: 414,
                unsupportedMediaType: 415,
                rangeNotSatisfiable: 416,
                expectationFailed: 417,
                imATeapot: 418,
                misdirectedRequest: 421,
                unprocessableEntity: 422,
                locked: 423,
                failedDependency: 424,
                unorderedCollection: 425,
                upgradeRequired: 426,
                preconditionRequired: 428,
                tooManyRequests: 429,
                requestHeaderFieldsTooLarge: 431,
                connectionClosedWithoutResponse: 444,
                unavailableForLegalReasons: 451,
                clientClosedRequest: 499
            },
            serverError: {
                internalServerError: 500,
                notImplemented: 501,
                badGateway: 502,
                serviceUnavailable: 503,
                gatewayTimeout: 504,
                httpVersionNotSupported: 505,
                variantAlsoNegotiates: 506,
                insufficientStorage: 507,
                loopDetected: 508,
                bandwidthLimitExceeded: 509,
                notExtended: 510,
                networkAuthenticationRequired: 511,
                networkConnectTimeoutError: 599
            }
        };

    }

    end(request, response, next, data){
        response.status(data.status)
                .set(data.header)
                .json(data.body);
    }

    notAcceptable(request, response, next, message){
        this.end(request, response, next, {
            body: {
                name: "Not acceptable",
                description: "The target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request1, and the server is unwilling to supply a default representation.",
                message: message
            },
            status: this.statusCodes.clientError.notAcceptable
        });
    }

    unsupportedMediaType(request, response, next, message){
        this.end(request, response, next, {
            body: {
                name: "MIME type unsupported",
                description: "The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.",
                message: message
            },
            status: this.statusCodes.clientError.unsupportedMediaType
        });
    }

    methodNotAllowed(request, response, next, message){
        this.end(request, response, next, {
            body: {
                name: "Method not allowed",
                description: `Method ${request.method} received in the request-line is known by the origin server but not supported by the target resource.`,
                message: message
            },
            status: this.statusCodes.clientError.methodNotAllowed
        });
    }

    notModified(request, response, next, message){
        this.end(request, response, next, {
            body: {
                name: "Not Modified",
                description: "The conditional is valid.",
                message: message
            },
            status: this.statusCodes.redirection.notModified
        });
    }

    createLinksGet(object, index, array){
        let links = [];
        
        links.push({
            type: "DELETE",
            rel: "remove",
            href: "http://localhost:3000/api/v0/users/" + object._id
        }, {
            type: "PUT",
            rel: "replace",
            href: "http://localhost:3000/api/v0/users/" + object._id
        }, {
            type: "PATCH",
            rel: "update",
            href: "http://localhost:3000/api/v0/users/" + object._id
        });

        return Object.assign({}, object._doc, {links});
    }
}

module.exports = new ResponseHand();
