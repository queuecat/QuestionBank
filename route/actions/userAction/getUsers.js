const { pick } = require('../../../tools/tools');

module.exports = (req, res) => {
    try {
        res.send(pick(req.session.userInfo, ['_id', 'email', 'username', 'avatar', 'role', 'createTime']));
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};