import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'

import {environment} from '../common/environment'
import {NotAuthorizedError} from 'restify-errors'
import {User} from '../users/users.model'

export const authenticate: restify.RequestHandler = (request, response, next) => {
    const {email, password} = request.body
    User.findByEmail(email, '+password')
        .then(user => {
            if(user && user.matches(password)) {
                const token = jwt.sign({
                    sub: user.email,
                    iss: 'meat-api'
                }, environment.security.apiSecret)
                response.json({
                    name: user.name,
                    email: user.email,
                    accessToken: token
                })
                return next(false)
            } else {
                return next(new NotAuthorizedError('Invalid Credentials'))
            }
        })
        .catch(next)
}