const mongoose = require('mongoose');
const joi = require('joi');


const Answers = mongoose.model('answer', new mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    content: {
        type: String,
        minlength: 1,
        required: true
    },
    md: {
        type: String,
        minlength: 1,
        required: true
    },
    image: {
        type: [String],
        default: null
    },
    meta: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
}));


let validateSchema = {
    title: joi.string().min(1).max(50).required().error(new Error('题解标题长度必须在 1 ~ 50 个字符之间！')),
    content: joi.string().min(1).required().error(new Error('题解内容长度必须大于 1 ！')),
    md: joi.string().min(1).required().error(new Error('题解 markdown 文本长度必须大于 1 ！')),
    image: joi.array().items(joi.string()),
    author: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('作者 _id 格式非法！')),
    question: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('题目 _id 格式非法！')),
}
function validateAnswer(answer) {
    return joi.validate(answer, validateSchema, {
        abortEarly: false,
        allowUnknown: false
    });
}

let validateUpdateSchema = {
    title: joi.string().min(1).max(50).error(new Error('题解标题长度必须在 1 ~ 50 个字符之间！')),
    content: joi.string().min(1).error(new Error('题解内容长度必须大于 1 ！')),
    md: joi.string().min(1).error(new Error('题解 markdown 文本长度必须大于 1 ！')),
    image: joi.array().allow()
}
function validateUpdateAnswer(answer) {
    return joi.validate(answer, validateUpdateSchema, {
        abortEarly: false,
        allowUnknown: false
    });
}
module.exports = {
    Answers,
    validateAnswer,
    validateUpdateAnswer
}