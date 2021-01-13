const express = require('express');
const captcha = require('svg-captcha');
const session = require('express-session');
// web服务器
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({ resave: false, name: 'test', secret: 'queuecat', saveUninitialized: false, cookie: { maxAge: 20 * 60 * 60 * 1000 } }))
    // app.get('/', (req, res) => {
    //     const cap = captcha.create({
    //         color: true,
    //         noise: 3
    //     });
    //     req.session.captcha = cap.text; // session 存储
    //     res.type('svg'); // 响应的类型
    //     console.log(req.session.captcha)
    //     res.send(cap.data);
    // });

app.get('/captcha', (req, res) => {
    const cap = captcha.create({
        color: true,
        noise: 3
    });
    req.session.captcha = cap.text; // session 存储
    res.send(cap.data);
});

app.post('/captcha', (req, res) => {
    const { username, email, password, captcha } = req.body;

    if (username.trim() == 0) {
        res.send('请填写用户名');
    }
    if (email.trim() == 0) {
        res.send('请填写邮箱');
    }
    if (password.trim() == 0) {
        res.send('请填写密码');
    }
    if (captcha.trim() == 0) {
        res.send('请填写验证码');
    }
    if (captcha.trim() == req.session.captcha || captcha == req.session.captcha.toUpperCase() || captcha == req.session.captcha.toLowerCase()) {

        res.send('填写正确');
    } else {

        res.send('验证码错误');

    }
})


// 监听端口
app.listen(3000, () => console.log('\033[42;30m成功\033[0m', '服务器启动'));