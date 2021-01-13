var svgCaptcha = require('svg-captcha');
module.exports = (req, res) => {
    try {
        var captcha = svgCaptcha.create({ noise: 5, color: true, background: '#fff', ignoreChars: '0o1il' });
        req.session.captcha = captcha.text.toLocaleLowerCase();
        res.send(captcha.data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};