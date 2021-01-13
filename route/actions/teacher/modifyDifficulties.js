const { Difficulties, validateUpdateDifficulty } = require('../../../model/Difficulties');
const { validateId } = require('../../../tools/tools');
module.exports = async (req, res) => {
    try {
        // 获取难度分类 id
        const _id = req.params['_id'];

        // 验证 id 格式
        let { error } = validateId(_id, '难度分类 id 非法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 验证修改参数
        ({ error } = validateUpdateDifficulty(req.fields));
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 更新
        const difficulty = await Difficulties.findByIdAndUpdate(_id, req.fields, { new: true });
        if (!difficulty) {
            return res.status(400).send({ message: '未找到该难度分类！' });
        }
        res.send(difficulty);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};