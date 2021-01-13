const { AnswersComments } = require('../../../model/AnswersComments');
const joi = require('joi');

module.exports = async (req, res) => {
    try {
        // 验证参数
        const schema = {
            page: joi.number().min(1).required().error(new Error('page 非法！')),
            count: joi.number().min(1).required().error(new Error('count 非法！')),
            answerId: joi.string().required().regex(/^[0-9a-fA-F]{24}$/).error(new Error('题解 id 非法！'))
        }
        // 验证
        const { error } = joi.validate(req.query, schema, { allowUnknown: false, abortEarly: false });
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 处理参数
        let { count, page, answerId } = req.query;
        count = Math.abs(count - 0);
        page = Math.abs(page - 0);
        count = count <= 30 ? count : 30;

        // 查询
        const comment = await
            AnswersComments.find({ answer: answerId })
                .populate('author', '-password')
                .sort('-publishDate').skip(count * (page - 1)).limit(count);

        // 返回一些辅助数据
        const total = await AnswersComments.countDocuments({ answer: answerId });
        let pages = [...new Array(Math.ceil(total / count)).keys()].map(value => value + 1 + '');
        res.send({ comment, pages, page: page + '', tailPage: Math.ceil(total / count), total });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
