const { Questions } = require('../../../model/Questions');
const joi = require('joi');

module.exports = async(req, res) => {
    try {
        // 验证参数
        const schema = {
                page: joi.number().min(1).required().error(new Error('page 非法！')),
                count: joi.number().min(1).required().error(new Error('count 非法！')),
                sort: joi.number().valid(0, 1, 2).required().error(new Error('sort 非法！')),
                categories: joi.array().error(new Error('categories 非法！')),
                difficulties: joi.array().error(new Error('difficulties 非法！')),
                key: joi.string().error(new Error('key 非法！'))
            }
            // 验证
        const { error } = joi.validate(req.query, schema, { allowUnknown: false, abortEarly: false });
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 处理参数
        // 处理分页参数
        let { count, page, sort, categories, difficulties, key } = req.query;

        count = Math.abs(count - 0);
        page = Math.abs(page - 0);
        count = count <= 30 ? count : 30;
        const sortMap = ['-publishDate', '-meta.likes', '-meta.views'];
        sort = sortMap[sort];

        let $and = [];
        // 处理查询参数
        if (key) {
            key = new RegExp(key.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');
            $and.push({ title: key });
        }

        // 处理分类参数
        if (categories) {
            const $or = { $or: categories.map((value, index) => ({ category: { $in: value } })) };
            $and.push($or)
        }
        if (difficulties) {
            const $or = { $or: difficulties.map((value, index) => ({ difficulty: value })) };
            $and.push($or);
        }

        // 查询
        const questions = await
        Questions.find($and.length ? { $and } : {})
            .populate('author', '-password').populate('category').populate('difficulty')
            .select('-md -description -image')
            .sort(sort).skip(count * (page - 1)).limit(count);

        // 返回一些辅助数据
        const total = await Questions.countDocuments($and.length ? { $and } : {});
        let pages = [...new Array(Math.ceil(total / count)).keys()].map(value => value + 1 + '');
        res.send({ questions, pages, page: page + '', tailPage: Math.ceil(total / count), total });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};