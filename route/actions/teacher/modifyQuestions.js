const { Questions, validateUpdateQuestion } = require('../../../model/Questions');
const { Difficulties } = require('../../../model/Difficulties');
const { Categories } = require('../../../model/Categories');

module.exports = async (req, res) => {
    try {
        // 取到参数
        const { _id } = req.params;

        // 验证 md 和 description 是否同时提交
        const { md, description } = req.fields;
        if (!((md && description) || (!md && !description))) {
            return res.status(400).send({ message: 'md 和 description 参数须同步提交！' });
        }

        // 验证格式
        const { error } = validateUpdateQuestion(req.fields);
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 验证题目是否存在
        let question = await Questions.findOne({ _id });
        if (!question) {
            return res.status(400).send({ message: '未找到该题目！' });
        }

        // 验证作者是否与当前用户相同
        const userId = req.session.userInfo._id;
        if (userId != question.author) {
            return res.status(400).send({ message: '没有修改权限！' });
        }

        // 处理分类字段
        const { category, difficulty } = req.fields;
        if (difficulty) {
            // 难度分类
            const difficultyFound = await Difficulties.findOne({ _id: difficulty });
            if (!difficultyFound) {
                return res.status(400).send({ message: '未找到该难度分类！' });
            }
        }
        if (category) {
            // 标签分类
            if (category.indexOf('-') != -1) {
                // 数组
                req.fields.category = [];
                for (const item of category.split('-')) {
                    const category = await Categories.findOne({ _id: item });
                    if (!category) {
                        return res.status(400).send({ message: '未找到该标签分类！' });
                    }
                    // 验证过了，添加 id
                    req.fields.category.push(item);
                }
            } else {
                // 单个
                // 验证
                const categoryFound = await Categories.findOne({ _id: category });
                if (!categoryFound) {
                    return res.status(400).send({ message: '未找到该难度分类！' });
                }
                req.fields.category = [category];
            }
        }


        // 修改
        const newAnswer = await Questions.findByIdAndUpdate(_id, req.fields, { new: true });
        res.send(await newAnswer.populate('category').populate('difficulty').execPopulate());
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};