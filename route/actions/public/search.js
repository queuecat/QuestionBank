const { Questions } = require('../../../model/Questions');
module.exports = async (req, res) => {
    // 修改查询
    try {
        const key = req.params['key'];
        if (key.trim().length == 0) {
            return res.status(400).send({ message: '查询参数不能为空！' });
        }
        // 处理 key，规避正则，然后转换为正则
        const regex = new RegExp(key.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');

        // search
        var beFound = await Questions.find({ title: regex }).populate('author', '-password').populate('category').populate('difficulty');
        res.send(beFound);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};