const { QuestionsWhoLikes } = require('../../../model/QuestionsWhoLikes');
const { Questions } = require('../../../model/Questions');
const { validateId } = require('../../../tools/tools');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
    try {
        // 获取参数 题目 id
        const _id = req.params['_id'];
        const userId = req.session.userInfo._id;

        // 验证 id
        const { error } = validateId(_id, '题目 id 格式非法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 查询题目
        let question = await Questions.findOne({ _id });
        if (!question) {
            return res.status(400).send({ message: '未找到欲点赞的题目！' });
        }

        // 判断是否点过赞
        isFound = await QuestionsWhoLikes.findOne({ question: _id, users: { $in: userId } });
        if (!!isFound) {
            return res.status(400).send({ message: '您已经点过赞了！' });
        }

        // 修改
        // 题目 who like 添加用户
        let qWhoLike = await QuestionsWhoLikes.findOne({ question: _id });
        // 增加健壮性，考虑 post 题目时未成功创建 whoLike 表
        if (!qWhoLike) {
            // 未找到则创建
            qWhoLike = await QuestionsWhoLikes.create({ question: _id });
        }
        qWhoLike.users.push(userId); await qWhoLike.save();


        // 同步点赞数
        question.meta.likes = (await QuestionsWhoLikes.aggregate(
            [{
                $match: {
                    question: mongoose.Types.ObjectId(_id)
                }
            }, {
                $project: {
                    users: {
                        $size: '$users'
                    }
                }
            }]).exec())[0].users; question.save();



        res.send({ message: '点赞成功！' });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};