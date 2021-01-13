const { Answers } = require('../../../model/Answers');
const { validateId } = require('../../../tools/tools');
const { AnswersWhoLikes } = require('../../../model/AnswersWhoLikes');

module.exports = async (req, res) => {
    try {
        const _id = req.params['_id'];
        // 验证
        const { error } = validateId(_id, '题解 id 非法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 查询
        const answer = await Answers.findOne({ _id })
            .populate('question', 'title').populate('author', '-password');

        // 查询是否点过赞
        let liked = false;
        // 判断用户登录
        const isFound = req.session.userInfo && await AnswersWhoLikes.findOne({ answer: _id, users: { $in: req.session.userInfo._id } });
        if (isFound) {
            liked = true;
        }

        if (answer) {
            // 浏览数 views + 1
            answer.meta.views++; answer.save();
            res.send({ answer, liked });
        } else {
            res.status(400).send({ message: '未找到该题解！' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};