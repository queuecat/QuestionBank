// 一级路由
module.exports = app => {

    // 游客路由
    app.use('/public', require('./public'));


    // 用户公用路由（学生路由） 
    app.use('/userAction', require('./userAction'));


    // 教师路由
    app.use('/teacher', require('./teacher'));


    // 管理员路由
    app.use('/admin', require('./admin'));

    // debug
    // app.post('/route', (req, res) => {
    //     console.log(req.fields);
    //     res.send('<h1>hello router!</h1>');
    // });
    app.use(require('../middleware/notFound'));

    // catch
    app.use((err, req, res, next) => {
        res.status(500).send({ message: err.message });
    })
}