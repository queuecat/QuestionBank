const { validateUpdate, Users } = require('../../../model/Users');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    try {
        // 获取当前用户 id 及 修改信息
        const _id = req.session.userInfo._id;
        let { oldPwd, newPwd, avatar } = req.fields;

        // 验证格式
        const { error } = validateUpdate(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }


        // 修改密码
        if (!((oldPwd && newPwd) || (!oldPwd && !newPwd))) {
            return res.status(400).send({ message: '旧密码与新密码须一同提交！' });
        }
        if (oldPwd && newPwd) {
            // 验证旧密码
            const user = await Users.findOne({ _id });
            if (!(await bcrypt.compare(oldPwd, user.password))) {
                return res.status(400).send({ message: '密码错误！' });
            }

            // 修改
            // 加密 
            newPwd = bcrypt.hashSync(newPwd, bcrypt.genSaltSync(10));
            await Users.findByIdAndUpdate(_id, { password: newPwd });
            req.session.userInfo.password = newPwd;
        }

        // 修改头像
        if (avatar) {
            await Users.findByIdAndUpdate(_id, { avatar });
        }

        res.send({ message: '修改成功！' })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};