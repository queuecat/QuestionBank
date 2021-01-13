module.exports = (req, res, next) => {
    try {
        const role = req.session.userInfo.role
        if (role != 'student' && role != 'teacher' && role == 'admin') {
            next();
        } else {
            return res.status(400).send({ message: '没有操作权限，请联系开发者或网站管理员！' });
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}