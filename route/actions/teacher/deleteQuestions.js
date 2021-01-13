const { Questions } = require('../../../model/Questions');
const { QuestionsWhoLikes } = require('../../../model/QuestionsWhoLikes');
const { Answers } = require('../../../model/Answers');
const { AnswersWhoLikes } = require('../../../model/AnswersWhoLikes');
const { AnswersComments } = require('../../../model/AnswersComments');
const { validateId } = require('../../../tools/tools');
const path = require('path');
const rmFile = require('util').promisify(require('fs').unlink);
module.exports = async (req, res) => {
    try {
        // 欲删除题目
        const _id = req.params['_id'];
        // 验证 id
        const { error } = validateId(_id, '题目 id 不合法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        // 查询题目
        let question = await Questions.findOne({ _id });
        if (!question) {
            return res.status(400).send({ message: '未找到该题目！' });
        }

        // 验证作者是否与当前用户相同
        const userId = req.session.userInfo._id;
        if (userId != question.author) {
            return res.status(400).send({ message: '没有删除权限！' });
        }

        // 删除题目下的下的题解
        let answers = (await Answers.find({ question: _id })).map((value, index) => value._id);
        if (answers.length) {
            for (answerId of answers) {
                let answer = await Answers.findOne({ _id: answerId });
                // 删除题解下的评论
                let comments = (await AnswersComments.find({ answer: answerId })).map((value, index) => value._id);
                if (comments.length) {
                    await AnswersComments.deleteMany({ _id: { $in: comments } });
                }
                // 删除题解包含的图片
                if (answer.image.length != 0) {
                    for (img of answer.image) {
                        try {
                            let a = path.join(__dirname, '..', '..', '..', 'public', img);
                            await rmFile(path.join(__dirname, '..', '..', '..', 'public', img));
                        } catch (error) {
                            console.log('删除题目-删除题解-删除图片-：', error);
                        }
                    }
                }
                // 删除题解
                await Answers.findOneAndDelete({ _id: answerId });
                // 删除 whoLikes 表
                await AnswersWhoLikes.findOneAndDelete({ answer: answerId });
            }
        }

        // 删除题目包含的图片
        if (question.image.length != 0) {
            for (img of question.image) {
                try {
                    let a = path.join(__dirname, '..', '..', '..', 'public', img);
                    await rmFile(path.join(__dirname, '..', '..', '..', 'public', img));
                } catch (error) {
                    console.log('删除题目-删除图片-：', error);
                }
            }
        }

        // 删除题目
        await Questions.findOneAndDelete({ _id });
        // 删除 whoLikes 表
        await QuestionsWhoLikes.findOneAndDelete({ question: _id });

        res.send({ message: '删除成功！' });
    } catch (error) {
        res.status(500).send({ message: error.message });

    }
};