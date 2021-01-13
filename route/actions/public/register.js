const { Users, validateRigister } = require('../../../model/Users');
const bcrypt = require('bcryptjs');
const { pick } = require('../../../tools/tools');

module.exports = async (req, res) => {
    try {
        // 获取 body 
        let { email, password, username, verification } = req.fields;
        // 验证码比对
        if (!(req.session.captcha && req.session.captcha.toLocaleLowerCase() === verification)) {
            return res.status(400).send({ message: '验证码错误！' });
        }
        // 重置验证码，防止未经验证的注册
        req.session.captcha = undefined;
        // 验证格式
        const { error } = validateRigister(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        // 删掉验证码字段
        delete req.fields.verification;

        // 数据库比对重复 email
        let existingUser = await Users.find({ email });
        if (existingUser.length) {
            return res.status(400).send({ message: '邮箱已存在！' });
        }
        // 数据库比对重复 username
        existingUser = await Users.find({ username });
        if (existingUser.length) {
            return res.status(400).send({ message: '用户名已存在！' });
        }
        // 验证通过
        // 加密
        req.fields.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        // 存入数据库
        const newUser = await Users.create(req.fields);
        res.send(pick(newUser, ['_id', 'email', 'username', 'avatar', 'role', 'createTime']))

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
};