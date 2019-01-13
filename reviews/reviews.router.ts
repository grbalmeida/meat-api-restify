import * as restify from 'restify'
import {ModelRouter} from '../common/model-router'
import {Review} from './reviews.model'

class ReviewsRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
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
        application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.post('/reviews', this.save)
    }
}

export const reviewsRouter = new ReviewsRouter()