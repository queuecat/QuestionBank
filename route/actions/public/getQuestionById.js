const { Questions } = require('../../../model/Questions');
const { validateId } = require('../../../tools/tools');
const { QuestionsWhoLikes } = require('../../../model/QuestionsWhoLikes');

module.exports = async (req, res) => {
    try {
        const _id = req.params['_id'];
        // 验证
        const { error } = validateId(_id, '题目 id 非法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        // 查询
        let question = await Questions.findOne({ _id })
            .populate('author', '-password').populate('category').populate('difficulty');

        // 查询是否点过赞
        let liked = false;
        // 判断用户登录
        const isFound = req.session.userInfo && await QuestionsWhoLikes.findOne({ question: _id, users: { $in: req.session.userInfo._id } });
        if (isFound) {
            liked = true;
        }

        if (question) {
            // 浏览数 views + 1
            question.meta.views++; question.save();
            res.send({ question, liked });
        } else {
            res.status(400).send({ message: '未找到该题目！' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};