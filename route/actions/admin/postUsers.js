const { Users, validateAdminRigister } = require('../../../model/Users');
const bcrypt = require('bcryptjs');
const { pick } = require('../../../tools/tools');

module.exports = async (req, res) => {
    try {
        let { password, username, email } = req.fields;
        // 验证格式
        const { error } = validateAdminRigister(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        // 验证 email 是否重合
        let emailFound = await Users.findOne({ email });
        if (emailFound) {
            // 存在重合的 email
            return res.status(400).send({ message: '邮箱已存在！' });
        }
        // 验证 username 是否重合
        let usernameFound = await Users.findOne({ username });
        if (usernameFound) {
            // 存在重合的 username
            return res.status(400).send({ message: '用户名已存在！' });
        }

        // 加密
        req.fields.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        // 添加
        const user = await Users.create(req.fields);
        res.send(pick(user, ['_id', 'email', 'username', 'avatar', 'role', 'createTime']))
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};