const mongoose = require('mongoose');
const joi = require('joi');


const Difficulties = mongoose.model('difficulty', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    createTime: {
        type: Date,
        default: Date.now
    }
}));


const validateSchema = {
    title: joi.string().min(1).max(20).required().error(new Error('难度分类长度必须在 1 ~ 20 个字符之间！'))
}
function validateDifficulty(difficulty) {
    return joi.validate(difficulty, validateSchema, {
        abortEarly: false,
        allowUnknown: false
    });
}

const validateUpdateSchema = {
    title: joi.string().min(1).max(20).error(new Error('难度分类长度必须在 1 ~ 20 个字符之间！'))
}
function validateUpdateDifficulty(difficulty) {
    return joi.validate(difficulty, validateUpdateSchema, {
        abortEarly: false,
        allowUnknown: false
    });
}

module.exports = {
    Difficulties,
    validateDifficulty,
    validateUpdateDifficulty
}