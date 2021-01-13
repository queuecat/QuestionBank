const { Answers, validateUpdateAnswer } = require('../../../model/Answers');

module.exports = async (req, res) => {
    try {
        // 取到参数
        const { _id } = req.params;

        // 验证 md 和 content 是否同时提交
        const { md, content } = req.fields;
        if (!((md && content) || (!md && !content))) {
            return res.status(400).send({ message: 'md 和 content 参数须同步提交！' });
        }

        // 验证格式
        const { error } = validateUpdateAnswer(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 验证题解是否存在
        let answer = await Answers.findOne({ _id });
        if (!answer) {
            return res.status(400).send({ message: '未找到该题解！' });
        }

        // 验证作者是否与当前用户相同
        const userId = req.session.userInfo._id;
        if (userId != answer.author) {
            return res.status(400).send({ message: '没有修改权限！' });
        }

        // 修改
        const newAnswer = await Answers.findByIdAndUpdate(_id, req.fields, { new: true });
        res.send(newAnswer);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};