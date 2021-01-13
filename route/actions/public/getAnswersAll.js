const { Answers } = require('../../../model/Answers');
const joi = require('joi');

module.exports = async(req, res) => {
    try {
        // 验证参数
        const schema = {
                page: joi.number().min(1).error(new Error('page 非法！')),
                count: joi.number().min(1).error(new Error('count 非法！')),
                sort: joi.number().valid(0, 1, 2, 3).error(new Error('sort 非法！')),
                questionId: joi.string().regex(/^[0-9a-fA-F]{24}$/).error(new Error('题目 id 非法！')),
                userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).error(new Error('userId 非法！')),
            }
            // 验证
        const { error } = joi.validate(req.query, schema, { allowUnknown: false, abortEarly: false });
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 处理参数
        let { count, page, sort: sortCondition, questionId, userId } = req.query;
        // 处理 userId
        let findCondition = {};
        let countCondition = {};
        if (questionId) {
            findCondition.question = questionId;
            countCondition.question = questionId;
        }
        if (userId) {
            findCondition.author = userId;
            countCondition.author = userId;
        }
        count = Math.abs(count - 0);
        page = Math.abs(page - 0);
        count = count <= 30 ? count : 30;
        const sortMap = ['-publishDate', '-meta.likes', '-meta.views', '-meta.comments'];
        sortCondition = sortMap[sortCondition];

        // 查询
        const answers = await
        Answers.find(findCondition)
            .populate('author', '-password')
            .select('-md -content -image');

        // 返回一些辅助数据
        const total = await Answers.countDocuments(countCondition);
        let pages = [...new Array(Math.ceil(total / count)).keys()].map(value => value + 1 + '');
        res.send({ answers, pages, page: page + '', tailPage: Math.ceil(total / count), total });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};