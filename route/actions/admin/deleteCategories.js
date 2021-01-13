const { Categories } = require('../../../model/Categories');
const { validateId } = require('../../../tools/tools');

module.exports = async (req, res) => {
    try {
        const _id = req.params['_id'];
        // 验证 id
        let { error } = validateId(_id, '标签分类 id 不合法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 删除
        let deleteResult = await Categories.findOneAndDelete({ _id });
        if (!deleteResult) {
            return res.status(400).send({ message: '未找到该标签分类！' });
        }
        res.send({ message: '删除成功！' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};