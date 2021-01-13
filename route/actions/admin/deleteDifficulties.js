const { Difficulties } = require('../../../model/Difficulties');
const { validateId } = require('../../../tools/tools');

module.exports = async (req, res) => {
    try {
        const _id = req.params['_id'];
        // 验证 id
        let { error } = validateId(_id, '难度分类 id 不合法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 删除
        let deleteResult = await Difficulties.findOneAndDelete({ _id });
        if (!deleteResult) {
            return res.status(400).send({ message: '未找到该难度分类！' });
        }
        res.send({ message: '删除成功！' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};