const { Users } = require('../model/Users');

module.exports = async (req, res, next) => {
    try {
        // 更新 session，若验证不通过则删除登陆状态
        if (req.session.userInfo) {
            // 取出哈希密码和邮箱
            const { password: hashPassword, email } = req.session.userInfo;
            // 密码验证
            const user = await Users.findOne({ email })
            if (!(user && user.password == hashPassword)) {
                // 不通过
                req.session.userInfo = undefined;
                return res.status(400).send({ message: '请您登陆后进行该操作！' });
            }
        } else {
            req.session.userInfo = undefined;
            return res.status(400).send({ message: '请您登陆后进行该操作！' });
        }

        // 验证通过，验证角色，为防止出现未定义的用户，这里判断复杂一些。
        const role = req.session.userInfo.role;
        if (role == 'student' || role == 'teacher' || role == 'admin') {
            next();
        } else {
            return res.status(400).send({ message: '账号角色异常，请联系开发者或网站管理员！' });
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}