const { Categories, validateCategory } = require('../../../model/Categories');
module.exports = async (req, res) => {
    try {
        // 验证
        const { error } = validateCategory(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 创建
        const newCategory = await Categories.create(req.fields);
        res.send(newCategory);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};