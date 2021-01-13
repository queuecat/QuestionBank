const { Answers, validateAnswer } = require('../../../model/Answers');
const { Questions } = require('../../../model/Questions');
const { AnswersWhoLikes } = require('../../../model/AnswersWhoLikes');

module.exports = async (req, res) => {
    try {
        // 添加一些属性 question author
        const { _id } = req.params;
        req.fields.question = _id;
        req.fields.author = req.session.userInfo && req.session.userInfo._id;
        // 验证
        const { error } = validateAnswer(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 验证题目是否存在
        let question = await Questions.findOne({ _id });
        if (!question) {
            return res.status(400).send({ message: '未找到该题目！' });
        }

        // 创建
        // 题解表
        const newAnswer = await Answers.create(req.fields);
        // 题解点赞表
        await AnswersWhoLikes.create({ answer: newAnswer._id });
        res.send(newAnswer);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};