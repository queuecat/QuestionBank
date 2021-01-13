module.exports = (req, res) => {
    req.session.destroy(err => {
        if (err == null) {
            res.clearCookie();
            res.send({ message: '登出成功！' });
        } else {
            res.status(500).send({ message: err.message });
        }
    });
};