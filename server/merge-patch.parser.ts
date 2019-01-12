import * as restify from 'restify'
import {BadRequestError} from 'restify-errors'

const mergePatchContentType: string = 'application/merge-patch+json'

export const mergePatchBodyParser = (request: restify.Request, response: restify.Response, next) => {
    if(request.getContentType() === mergePatchContentType && request.method === 'PATCH') {
        (<any>request).rawBody = request.body
        try {
            request.body = JSON.parse(request.body)
        } catch(e) {
            return next(new BadRequestError(`Invalid Content: ${e.message}`))
        }
    }
    return next()
}