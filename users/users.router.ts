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

        application.post('/users', (request, response, next) => {
            let user: User = new User(request.body)
            user.save().then(user => {
                user.password = undefined
                response.json(user)
                return next()
            })
        })

        application.put('/users/:id', (request, response, next) => {
            const options = {overwrite: true}
            User.update({_id: request.params.id}, request.body, options)
                .exec()
                .then(result => {
                    if(result.n) {
                        return User.findById(request.params.id)
                            .then(user => user)
                    } else {
                        response.send(404)
                    }
                })
                .then(user => {
                    response.json(user)
                    return next()
                })
        })

        application.patch('/users/:id', (request, response, next) => {
            const options = {new: true}
            User.findByIdAndUpdate(request.params.id, request.body, options)
                .then(user => {
                    if(user) {
                        response.json(user)
                        return next()
                    }

                    response.send(404)
                    return next()
                })
        })

        application.del('/users/:id', (request, response, next) => {
            User.remove({_id: request.params.id})
                .exec()
                .then((cmdResult: any) => {
                    if(cmdResult.result.n) {
                        response.send(204)
                    } else {
                        response.send(404)
                    }
                    return next()
                })
        })
    }
}

export const usersRouter = new UsersRouter()