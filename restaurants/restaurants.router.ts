import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Restaurant} from './restaurants.model'
import {NotFoundError} from 'restify-errors'

class RestaurantsRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant)
    }

    envelope(document) {
        let resource = super.envelope(document)
        resource._links.menu = `${this.basePath}/${resource._id}/menu`
        return resource
    }

    findMenu = (request, response, next) => {
        Restaurant.findById(request.params.id, '+menu')
            .then(restaurant => {
                if(!restaurant) {
                    throw new NotFoundError('Restaurant not found')
                } else {
                    response.json(restaurant.menu)
                    return next()
                }
            })
            .catch(next)
    }

    replaceMenu = (request, response, next) => {
        Restaurant.findById(request.params.id)
            .then(restaurant => {
                if(!restaurant) {
                    throw new NotFoundError('Restaurant not found')
                } else {
                    restaurant.menu = request.body
                    return restaurant.save()
                }
            })
            .then(restaurant => {
                response.json(restaurant.menu)
                return next()
            })
            .catch(next)
    }

    applyRoutes(application: restify.Server) {
        application.get(this.basePath, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(this.basePath, this.save)
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace])
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update])
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete])
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu])
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantsRouter()