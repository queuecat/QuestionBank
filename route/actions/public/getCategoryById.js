const { Categories } = require('../../../model/Categories');
const { validateId } = require('../../../tools/tools');
module.exports = async (req, res) => {
    try {
        const _id = req.params['_id'];
        // 验证
        const { error } = validateId(_id, '标签分类 id 非法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 查询
        const category = await Categories.findOne({ _id });
        if (category) {
            res.send(category);
        } else {
            res.status(400).send({ message: '未找到该标签分类！' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};