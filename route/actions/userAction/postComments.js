const { AnswersComments, validateAnswersComment } = require('../../../model/AnswersComments');
const { Answers } = require('../../../model/Answers');
module.exports = async (req, res) => {
    try {
        // 添加一些属性 author answer
        const { _id } = req.params;
        req.fields.answer = _id;
        req.fields.author = req.session.userInfo && req.session.userInfo._id;

        // 验证
        const { error } = validateAnswersComment(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 验证题解是否存在
        let answer = await Answers.findOne({ _id });
        if (!answer) {
            return res.status(400).send({ message: '未找到该题解！' });
        }

        // 添加
        const newComment = await AnswersComments.create(req.fields);
        // 对应题解 meta.comments + 1 
        answer.meta.comments++; answer.save();
        res.send({ newComment })
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};