const { Users, validateAdminUpdate } = require('../../../model/Users');
const bcrypt = require('bcryptjs');
module.exports = async (req, res) => {
    try {
        // 拿到信息
        let _id = req.params['_id'];
        let { password, username, email } = req.fields;

        // 验证
        const { error } = validateAdminUpdate(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 验证 email 是否重合
        if (email) {
            let emailFound = await Users.findOne({ email });
            if (emailFound) {
                // 存在重合的 email
                return res.status(400).send({ message: '邮箱已存在！' });
            }
        }
        // 验证 username 是否重合
        if (username) {
            let usernameFound = await Users.findOne({ username });
            if (usernameFound) {
                // 存在重合的 username
                return res.status(400).send({ message: '用户名已存在！' });
            }
        }

        if (password) {
            // 加密
            req.fields.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        }
        // 修改
        const user = await Users.findByIdAndUpdate(_id, req.fields, { new: true }).select('-password');
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};