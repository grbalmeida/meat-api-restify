import * as mongoose from 'mongoose'
import {emailRegex} from '../common/regex'
import {validateCPF} from '../common/validators'

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: emailRegex
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
          validator: validateCPF,
          message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
})

export const User = mongoose.model<User>('User', userSchema)