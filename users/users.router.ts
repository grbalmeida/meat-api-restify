import * as restify from 'restify'
import {Router} from '../common/router'
import {User} from './users.model'

class UsersRouter extends Router {
    applyRoutes(application: restify.Server) {
        application.get('/users', (request, response, next) => {
            User.find().then(users => {
                response.json(users)
                return next()
            })
        })

        application.get('/users/:id', (request, response, next) => {
            User.findById(request.params.id).then(user => {
                if(user) {
                    response.json(user)
                    return next()
                }

                response.send(404)
                return next()
            })
        })
    }
}

export const usersRouter = new UsersRouter()