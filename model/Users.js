const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const joi = require('joi');

// 模型
Users = mongoose.model('user', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 30
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        // maxlength: 15
    },
    password: {
        type: String,
        required: true,
        minlength: 1

    },
    avatar: {
        type: String,
        maxlength: 100,
        default: null
    },
    path: {
        type: String,
        maxlength: 100,
        default: null
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'teacher'],
        default: 'student'
    },
    createTime: {
        type: Date,
        default: Date.now
    }

}));

// joi 管理员添加用户验证模型
const registerAdminSchema = {
        email: joi.string().min(2).max(30).email().required().error(new Error('邮箱长度必须在 2 ~ 30 个字符之间！')),
        password: joi.string().min(1).max(30).required().error(new Error('密码长度必须在 1 ~ 30 个字符之间！')),
        username: joi.string().min(1).max(15).required().error(new Error('用户名长度必须在 1 ~ 15 个字符之间！')),
        role: joi.string().valid('admin', 'student', 'teacher'),
        avatar: joi.string().min(1).max(100).error(new Error('头像路径长度须在 1 ~ 100 之间')),
    }
    // 管理员添加用户验证
function validateAdminRigister(user) {
    return joi.validate(user, registerAdminSchema, {
        // 检测到所有错误
        abortEarly: false,
        // 不允许包含位置的键
        allowUnknown: false
    });
}


// joi 管理员修改用户验证模型
const AdminUpdateSchema = {
        email: joi.string().min(2).max(30).email().error(new Error('邮箱长度必须在 2 ~ 30 个字符之间！')),
        password: joi.string().min(1).max(30).error(new Error('密码长度必须在 1 ~ 30 个字符之间！')),
        username: joi.string().min(1).max(15).error(new Error('用户名长度必须在 1 ~ 15 个字符之间！')),
        role: joi.string().valid('admin', 'student', 'teacher'),
        avatar: joi.string().min(1).max(100).error(new Error('头像路径长度须在 1 ~ 100 之间')),
    }
    // 管理员修改用户验证
function validateAdminUpdate(user) {
    return joi.validate(user, AdminUpdateSchema, {
        // 检测到所有错误
        abortEarly: false,
        // 不允许包含位置的键
        allowUnknown: false
    });
}


// joi 注册验证模型
const registerSchema = {
        email: joi.string().min(2).max(30).email().required().error(new Error('邮箱长度必须在 2 ~ 30 个字符之间！')),
        password: joi.string().min(1).max(30).required().error(new Error('密码长度必须在 1 ~ 30 个字符之间！')),
        username: joi.string().min(1).max(15).required().error(new Error('用户名长度必须在 1 ~ 15 个字符之间！')),
        verification: joi.string().required().error(new Error('验证码错误！'))
    }
    // 注册验证
function validateRigister(user) {
    return joi.validate(user, registerSchema, {
        // 检测到所有错误
        abortEarly: false,
        // 不允许包含位置的键
        allowUnknown: false
    });
}


// joi 登录验证模型
const loginSchema = {
        email: joi.string().min(2).max(30).email().required().error(new Error('邮箱或密码错误！')),
        password: joi.string().min(1).max(30).required().error(new Error('邮箱或密码错误！')),
        verification: joi.string().required().error(new Error('验证码错误！'))

    }
    // 登录验证
function validateLogin(user) {
    return joi.validate(user, loginSchema, {
        // 检测到所有错误
        abortEarly: false,
        // 不允许包含位置的键
        allowUnknown: false
    });
}


// joi 修改验证模型
const updatePwdSchema = {
        oldPwd: joi.string().min(1).max(30).error(new Error('密码格式错误！')),
        newPwd: joi.string().min(1).max(30).error(new Error('密码格式错误！')),
        avatar: joi.string().min(1).max(100).error(new Error('头像路径长度须在 1 ~ 100 之间'))
    }
    // 修改验证
function validateUpdate(user) {
    return joi.validate(user, updatePwdSchema, {
        // 检测到所有错误
        abortEarly: false,
        // 不允许包含位置的键
        allowUnknown: false
    });
}


async function creatAdmin() {
    if (await Users.findOne({ email: '2356583659@qq.com' }) == null) {
        console.log('创建了 admin 账号');
        let salt = await bcrypt.genSalt(10);
        let pwd = await bcrypt.hash('745663', salt);
        try {
            await Users.create({
                email: '2356583659@qq.com',
                username: '列队猫',
                password: pwd,
                role: 'admin'
            });
        } catch (error) {
            console.log('创建 admin 出错：' + error.message);
        }
    }
}
creatAdmin();


module.exports = {
    Users,
    validateRigister,
    validateLogin,
    validateAdminRigister,
    validateUpdate,
    validateAdminUpdate
};