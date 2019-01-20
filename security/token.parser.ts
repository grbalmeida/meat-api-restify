import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import {User} from '../users/users.model'
import {environment} from '../common/environment'

export const tokenParser: restify.RequestHandler = (request, response, next) => {
    const token = extractToken(request)

    if(token) {
        jwt.verify(token, environment.security.apiSecret, applyBearer(request, next))
    } else {
        next()
    }
}

function extractToken(request: restify.Request) {
    let token = undefined
    const authorization: string = request.header('authorization')

    if(authorization) {
        const parts: string[] = authorization.split(' ')

        if(parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1]
        }
    }

    return token
}

function applyBearer(request: restify.Request, next): (error, decoded) => void {
    return (error, decoded) => {
        if(decoded) {
            User.findByEmail(decoded.sub)
                .then(user => {
                    if(user) {
                        request.authenticated = user
                    }
                    next()
                })
                .catch(next)
        } else {
            next()
        }
    }
}