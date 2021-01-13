const { AnswersComments } = require('../../../model/AnswersComments');
const { validateId } = require('../../../tools/tools');

module.exports = async (req, res) => {
    try {
        const _id = req.params['_id'];
        // 验证 id
        let { error } = validateId(_id, '评论 id 不合法！');
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 查询题解
        let comment = await AnswersComments.findOne({ _id });
        if (!comment) {
            return res.status(400).send({ message: '未找到该评论！' });
        }

        // 验证作者是否与当前用户相同
        const userId = req.session.userInfo._id;
        if (userId != comment.author) {
            return res.status(400).send({ message: '没有删除权限！' });
        }

        // 删除
        await AnswersComments.findOneAndDelete({ _id });

        res.send({ message: '删除成功！' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};