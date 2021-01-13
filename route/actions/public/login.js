const { Users, validateLogin } = require('../../../model/Users');
const bcrypt = require('bcryptjs');
const { pick } = require('../../../tools/tools');
module.exports = async (req, res) => {
    try {
        // 验证格式
        const { error } = validateLogin(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 获取 body 
        let { email, password, verification } = req.fields;

        // 删掉 userInfo
        delete req.session.userInfo;

        // 验证码比对
        if (!(req.session.captcha && req.session.captcha === verification.toLocaleLowerCase())) {
            // 重置验证码，防止未经验证的登录
            req.session.captcha = undefined;
            return res.status(400).send({ message: '验证码错误！' });
        }
        req.session.captcha = undefined;

        // 数据库比对
        let user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: '邮箱或密码错误！' });
        }
        // 密码比对
        if (await bcrypt.compare(password, user.password)) {
            // 密码正确
            req.session.userInfo = user;
            return res.send(pick(user, ['_id', 'email', 'username', 'avatar', 'role', 'createTime']))
        } else {
            // 密码错误
            return res.status(400).send({ message: '邮箱或密码错误！' });
        }
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }

};