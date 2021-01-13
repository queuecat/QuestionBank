const mongoose = require('mongoose');
const joi = require('joi');


const AnswersComments = mongoose.model('answersComment', new mongoose.Schema({
    content: {
        type: String,
        minlength: 1,
        maxlength: 1000,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'answer',
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
}));


const validateSchema = {
    content: joi.string().min(1).max(1000).required().error(new Error('评论内容长度必须在 1 ~ 1000 个字符之间！')),
    author: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('作者 _id 格式非法！')),
    answer: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('题目 _id 格式非法！'))
}
function validateAnswersComment(answersComment) {
    return joi.validate(answersComment, validateSchema, {
        abortEarly: false,
        allowUnknown: false
    });
}


module.exports = {
    AnswersComments,
    validateAnswersComment
}