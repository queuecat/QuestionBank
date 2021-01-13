const { Categories, validateUpdateCategory } = require('../../../model/Categories');
const { validateId } = require('../../../tools/tools');
module.exports = async (req, res) => {
    try {
        // 获取难度分类 id
        const _id = req.params['_id'];

        // 验证 id 格式
        let { error } = validateId(_id, '标签分类 id 非法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 验证修改参数
        ({ error } = validateUpdateCategory(req.fields));
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 更新
        const category = await Categories.findByIdAndUpdate(_id, req.fields, { new: true });
        if (!category) {
            return res.status(400).send({ message: '未找到该标签分类！' });
        }
        res.send(category);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};