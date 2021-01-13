const { AnswersComments } = require('../../../model/AnswersComments');
const { validateId } = require('../../../tools/tools');
module.exports = async (req, res) => {
    try {
        const _id = req.params['_id'];
        // 验证
        const { error } = validateId(_id, '评论 id 非法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        // 查询
        const comment = await AnswersComments.findOne({ _id }).populate('author', '-password');
        if (comment) {
            res.send(comment);
        } else {
            res.status(400).send({ message: '未找到该评论！' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};