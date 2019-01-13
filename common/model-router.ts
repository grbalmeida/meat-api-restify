import * as mongoose from 'mongoose'
import {NotFoundError} from 'restify-errors'
import {Router} from './router'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>) {
        super()
    }

    validateId = (request, response, next) => {
        if(!mongoose.Types.ObjectId.isValid(request.params.id)) {
            next(new NotFoundError('Document not found'))
        } else {
            next()
        }
    }

    findAll = (request, response, next) => {
        this.model
            .find()
            .then(this.renderAll(response, next))
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