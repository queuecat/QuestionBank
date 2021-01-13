const { Users } = require('../../../model/Users');
const { validateId, pick } = require('../../../tools/tools');
module.exports = async (req, res) => {
    try {
        // 用户
        const _id = req.params['_id'];
        const { error } = validateId(_id, '用户 id 不合法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 查询
        const user = await Users.findOne({ _id });
        if (!user) {
            return res.status(400).send({ message: '未找到该用户！' })
        }
        res.send(pick(user, ['_id', 'email', 'username', 'avatar', 'role', 'createTime']));
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};