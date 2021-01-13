module.exports = (req, res, next) => {
    if (!req.secure) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
};