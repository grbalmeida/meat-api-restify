import * as restify from 'restify'
import {Router} from './common/router'

class IndexRouter extends Router {
    getLinks = (request: restify.Request, response: restify.Response, next) => {
        const links = {
            users: '/users',
            restaurants: '/restaurants',
            reviews: '/reviews'
        }

        response.json(links)
        return next()
    }

    applyRoutes(application: restify.Server) {
        application.get('/', this.getLinks)
    }
}

export const indexRouter = new IndexRouter()