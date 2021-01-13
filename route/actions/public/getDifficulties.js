const { Difficulties } = require('../../../model/Difficulties');
module.exports = async (req, res) => {
    try {
        res.send(await Difficulties.find());
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};