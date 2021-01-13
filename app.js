const express = require('express');
const http = require('http');
// const https = require('https');
const formidable = require('express-formidable');
const session = require('express-session');
const path = require('path');
const { processFile } = require('./tools/tools');
require('./model/Users');
// mongodb
require('./model/connect');
// create server
const app = express();

httpServer = http.createServer(app);



var sessionOptions = {
    // session options
    name: 'questionBank@gaolihai',
    secret: '$PV&eiEDk&h(Yg$DN0&',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
};
// env
if (process.env.NODE_ENV == 'development') {
    // app.use(require('morgan')('dev'));
} else {
    // 生产环境
    //app.use(require('./middleware/httpsRedirect'));
    // sessionOptions.cookie = { secure: true, maxAge: 1000 * 60 * 60 * 24 }
}

// static
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session(sessionOptions));

// parse body
app.use(formidable({
    // 文件上传目录
    uploadDir: path.join(__dirname, 'public', 'uploads'),
    // 最大上传文件为2M
    maxFileSize: 2 * 1024 * 1024,
    // 保留文件扩展名
    keepExtensions: true
}, [{ event: 'error', action: () => void(0) }]));

// router
require('./route')(app);

// listen
httpServer.listen(3001, () => {
    console.log(' \033[42;1m Done \033[0m \033[1m Server is listening on port 3000 \033[0m');
});