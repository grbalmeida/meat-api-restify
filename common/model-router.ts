import * as mongoose from 'mongoose'
import {NotFoundError} from 'restify-errors'
import {Router} from './router'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    basePath: string
    pageSize: number = 1

    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${model.collection.name}`
    }

    envelope(document: any) {
        let resource = Object.assign({_links: {}}, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

    validateId = (request, response, next) => {
        if(!mongoose.Types.ObjectId.isValid(request.params.id)) {
            next(new NotFoundError('Document not found'))
        } else {
            next()
        }
    }

    envelopeAll(documents: any[], options): any {
        const resource: any = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        }

        if(options.page && options.count && options.pageSize) {
            if(options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
            }

            const remaining = options.count - (options.page * options.pageSize)

            if(remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`
            }
        }

        return resource
    }

    findAll = (request, response, next) => {
        let page = parseInt(request.query._page || 1)
        page = page > 0 ? page : 1
        const skip = (page - 1) * this.pageSize

        this.model
            .count({})
            .exec()
            .then(count => {
                this.model
                    .find()
                    .skip(skip)
                    .limit(this.pageSize)
                    .then(this.renderAll(response, next, {
                        page, 
                        count, 
                        pageSize: this.pageSize, 
                        url: request.url
                    }))
            })
            .catch(next)
    }

    findById = (request, response, next) => {
        this.model
            .findById(request.params.id)
            .then(this.render(response, next))
            .catch(next)
    }

    save = (request, response, next) => {
        let document = new this.model(request.body)
        document.save()
            .then(this.render(response, next))
            .catch(next)
    }

    replace = (request, response, next) => {
        const options = {runValidators: true, overwrite: true}
            this.model.update({_id: request.params.id}, request.body, options)
                .exec()
                .then(result => {
                    if(result.n) {
                        return this.model.findById(request.params.id)
                            .then(user => user)
                    } else {
                        throw new NotFoundError('Documento não encontrado')
                    }
                })
                .then(this.render(response, next))
                .catch(next)
    }

    update = (request, response, next) => {
        const options = {runValidators: true, new: true}
            this.model.findByIdAndUpdate(request.params.id, request.body, options)
                .then(this.render(response, next))
                .catch(next)
    }

    delete = (request, response, next) => {
        this.model.remove({_id: request.params.id})
            .exec()
            .then((cmdResult: any) => {
                if(cmdResult.result.n) {
                    response.send(204)
                } else {
                    throw new NotFoundError('Documento não encontrado')
                }
                return next()
            })
            .catch(next)
    }
}