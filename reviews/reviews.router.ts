import * as restify from 'restify'
import {ModelRouter} from '../common/model-router'
import {Review} from './reviews.model'
import {authorize} from '../security/authz.handler'

class ReviewsRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
    }

    envelope(document) {
        let resource = super.envelope(document)
        const restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant 
        resource._links.restaurant = `/restaurants/${restaurantId}`
        return resource
    }

    findById = (request, response, next) => {
        this.model
            .findById(request.params.id)
            .populate('user', 'name')
            .populate('restaurant', 'name')
            .then(this.render(response, next))
            .catch(next)
    }

    applyRoutes(application: restify.Server) {
        application.get(this.basePath, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(this.basePath, [authorize('user'), this.save])
    }
}

export const reviewsRouter = new ReviewsRouter()