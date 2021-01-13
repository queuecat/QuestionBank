const mongoose = require('mongoose');
const joi = require('joi');


const Questions = mongoose.model('question', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 1
    },
    md: {
        type: String,
        required: true,
        minlength: 1
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
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
        default: null
    },
    difficulty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'difficulty',
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
}));


const validateSchema = {
    title: joi.string().min(1).max(50).required().error(new Error('题目标题长度必须在 1 ~ 50 个字符之间！')),
    description: joi.string().min(1).required().error(new Error('题目描述长度必须大于 1 ！')),
    md: joi.string().min(1).required().error(new Error('题目 markdown 文本长度必须大于 1 ！')),
    image: joi.array().items(joi.string()),
    author: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('作者 _id 格式非法！')),
    category: joi.string().error(new Error('标签分类 _id 格式非法！')),
    difficulty: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('难度分类 _id 格式非法！'))
}
function validateQuestion(question) {
    return joi.validate(question, validateSchema, {
        abortEarly: false,
        allowUnknown: false
    });
}

const validateUpdateSchema = {
    title: joi.string().min(1).max(50).error(new Error('题目标题长度必须在 1 ~ 50 个字符之间！')),
    description: joi.string().min(1).error(new Error('题目描述长度必须大于 1 ！')),
    md: joi.string().min(1).error(new Error('题目 markdown 文本长度必须大于 1 ！')),
    image: joi.array().items(joi.string()),
    category: joi.string().error(new Error('标签分类 _id 格式非法！')),
    difficulty: joi.string().regex(/^[0-9a-fA-F]{24}$/).error(new Error('难度分类 _id 格式非法！'))
}
function validateUpdateQuestion(question) {
    return joi.validate(question, validateUpdateSchema, {
        abortEarly: false,
        allowUnknown: false
    });
}
module.exports = {
    Questions,
    validateQuestion,
    validateUpdateQuestion
}