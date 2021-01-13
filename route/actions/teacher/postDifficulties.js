const { Difficulties, validateDifficulty } = require('../../../model/Difficulties');
module.exports = async (req, res) => {
    try {
        // 验证
        const { error } = validateDifficulty(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 创建
        const newDifficulty = await Difficulties.create(req.fields);
        res.send(newDifficulty);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};