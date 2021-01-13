const { Answers } = require('../../../model/Answers');
const joi = require('joi');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
    try {
        // 验证参数
        const schema = {
            page: joi.number().min(1).required().error(new Error('page 非法！')),
            count: joi.number().min(1).required().error(new Error('count 非法！')),
            sort: joi.number().valid(0, 1, 2, 3).required().error(new Error('sort 非法！')),
            questionId: joi.string().regex(/^[0-9a-fA-F]{24}$/).error(new Error('题目 id 非法！')),
            userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).error(new Error('userId 非法！')),
            role: joi.string().valid('student', 'teacher', 'admin').error(new Error('role 非法！'))
        }
        // 验证
        const { error } = joi.validate(req.query, schema, { allowUnknown: false, abortEarly: false });
        if (error) {
            return res.status(400).send({ message: error.message });
        }


        // 处理参数
        let { count, page, sort: sortCondition, questionId, userId, role } = req.query;

        // 处理 查询条件
        let findCondition = {};
        let countCondition = {};
        if (questionId) {
            findCondition.question = mongoose.Types.ObjectId(questionId);
            countCondition.question = questionId;
        }
        if (userId) {
            findCondition.author = mongoose.Types.ObjectId(userId);
            countCondition.author = userId;
        }
        // 有 userId 时，role 与其冲突，此时舍弃 role 参数
        if (role && !userId) {
            findCondition['author.role'] = role;
        }


        // 处理分页数据
        count = Math.abs(count - 0);
        page = Math.abs(page - 0);
        count = count <= 30 ? count : 30;
        const sortMap = [{ publishDate: -1 }, { 'meta.likes': -1 }, { 'meta.views': -1 }, { 'meta.comments': -1 }];
        sortCondition = sortMap[sortCondition];


        // 配置聚合参数
        let pipe = []
        if (role && !userId) {
            pipe.push({ $lookup: { from: 'users', localField: "author", foreignField: "_id", as: "author" } });
            pipe.push({ $match: findCondition });

        } else {
            pipe.push({ $match: findCondition });
            pipe.push({ $lookup: { from: 'users', localField: "author", foreignField: "_id", as: "author" } });
        }
        // 排序
        pipe.push({ $sort: sortCondition });

        // 计算个数 + 要返回的一些辅助分页数据
        pipe.push({ $count: 'total' });
        const countRe = (await Answers.aggregate(pipe))[0];
        const total = countRe ? countRe.total : 0;
        let pages = [...new Array(Math.ceil(total / count)).keys()].map(value => value + 1 + '');
        // 结束，统计总数的条件出栈
        pipe.pop();

        // 去掉不需要的字段
        pipe.push({ $project: { md: 0, content: 0, image: 0, 'author.password': 0 } });
        // 分页
        pipe.push({ $skip: count * (page - 1) });
        pipe.push({ $limit: count });


        // 聚合查询
        const answers = (await Answers.aggregate(pipe).exec())
            .map((value, index) => {
                value.author = value.author && (value.author.length ? value.author[0] : null);
                return value;
            });

        res.send({ answers, pages, page: page + '', tailPage: Math.ceil(total / count), total });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
