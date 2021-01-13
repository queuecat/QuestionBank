const { Questions, validateQuestion } = require('../../../model/Questions');
const { Difficulties } = require('../../../model/Difficulties');
const { Categories } = require('../../../model/Categories');
const { QuestionsWhoLikes } = require('../../../model/QuestionsWhoLikes');

module.exports = async(req, res) => {
    try {
        // 获取当前教师的 id
        req.fields.author = req.session.userInfo && req.session.userInfo._id;
        // 验证格式
        const { error } = validateQuestion(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 处理分类字段
        const { category, difficulty } = req.fields;
        // 难度分类
        const difficultyFound = await Difficulties.findOne({ _id: difficulty });
        if (!difficultyFound) {
            return res.status(400).send({ message: '未找到该难度分类！' });
        }

        // 标签分类
        if (category.indexOf('-') != -1) {
            // 数组
            for (const item of category.split('-')) {
                try {
                    const category = await Categories.findOne({ _id: item });
                    if (!category) {
                        return res.status(400).send({ message: '未找到该标签分类！' });
                    }
                } catch (error) {
                    return res.status(400).send({ message: '未找到该标签分类！' });
                }
                // 验证过了，添加 id
            }
            req.fields.category = category.split('-');
        } else {
            // 单个
            // 验证
            try {
                const categoryFound = await Categories.findOne({ _id: category });
                if (!categoryFound) {
                    return res.status(400).send({ message: '未找到该难度分类！' });
                }
            } catch (error) {
                return res.status(400).send({ message: '未找到该难度分类！' });
            }
            req.fields.category = [category];
        }


        // 创建
        // 题目表
        const newQuestion = await Questions.create(req.fields);
        // 题目点赞表
        await QuestionsWhoLikes.create({ question: newQuestion._id });
        res.send(await newQuestion.populate('category').populate('difficulty').execPopulate());
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};