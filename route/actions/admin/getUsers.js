const { Users } = require('../../../model/Users');
const joi = require('joi');
module.exports = async (req, res) => {
    try {
        // 验证参数
        const schema = {
            page: joi.number().min(1).required().error(new Error('page 非法！')),
            count: joi.number().min(1).required().error(new Error('count 非法！')),
            role: joi.string().valid('admin', 'teacher', 'student').error(new Error('role 非法！'))
        }
        // 验证
        const { error } = joi.validate(req.query, schema, { allowUnknown: false, abortEarly: false });
        if (error) {
            return res.status(400).send({ message: error.message });
        }

        // 处理参数
        let { count, page, role } = req.query;
        count = Math.abs(count - 0);
        page = Math.abs(page - 0);
        count = count <= 30 ? count : 30;

        // 查询
        const users = await
            Users.find(role ? { role } : null)
                .select('-password -path')
                .sort('-createTime').skip(count * (page - 1)).limit(count);

        // 返回一些辅助数据
        const total = await Users.countDocuments({});
        let pages = [...new Array(Math.ceil(total / count)).keys()].map(value => value + 1 + '');
        res.send({ users, pages, page: page + '', tailPage: Math.ceil(total / count), total });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};