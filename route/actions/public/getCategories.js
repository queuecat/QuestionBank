const { Categories } = require('../../../model/Categories');
module.exports = async (req, res) => {
    try {
        res.send(await Categories.find());
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};