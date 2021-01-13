const { Users, validateLogin } = require('../../../model/Users');
module.exports = async(req, res) => {
    try {
        // 用户
        if (!req.session.userInfo) {
            return res.send('window.isLogin = false;');
        }
        // const user = req.session.userInfo;
        const user = await Users.findOne({ _id: req.session.userInfo._id });
        // if (user.avatar == null) {
        //     user.avatar = '/';
        // }
        returnText = `
        window.user = {
            _id : '${user._id}',
            email : '${user.email}',
            username : '${user.username}',
            avatar : '${user.avatar && user.avatar.replace(/\\/g, '/')}',
            role : '${user.role}',
        };
        window.isLogin = true;
        `
        res.send(returnText);
    } catch (error) {
        res.status(500).send(`window.userError = ${error.message};`);
    }
};