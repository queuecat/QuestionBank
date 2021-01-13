const router = require('express').Router();

// 中间件 - 登录拦截（用户行为拦截 + 更新 session）
router.use(require('../middleware/loginGuard'));

// 题目点赞 / 取消点赞
router.post('/likes/questions/:_id', require('./actions/userAction/likesQuestions'));
router.delete('/likes/questions/:_id', require('./actions/userAction/deleteLikesQuestions'));

// 题解点赞 / 取消点赞
router.post('/likes/answers/:_id', require('./actions/userAction/likesAnswers'));
router.delete('/likes/answers/:_id', require('./actions/userAction/deleteLikesAnswers'));

// 评论题解
router.post('/comments/:_id', require('./actions/userAction/postComments'));

// 删除评论
router.delete('/comments/:_id', require('./actions/userAction/deleteComments'));

// 添加题解
router.post('/answers/:_id', require('./actions/userAction/postAnswers'));

// 修改题解
router.put('/answers/:_id', require('./actions/userAction/modifyAnswers'));

// 删除题解
router.delete('/answers/:_id', require('./actions/userAction/deleteAnswers'));

// 获取当前用户信息
router.get('/users', require('./actions/userAction/getUsers'));
// 根据 id 获取用户信息
router.get('/users/:_id', require('./actions/userAction/getUserById'));

// 修改当前用户信息
router.put('/users', require('./actions/userAction/modifyUsers'));

// 图片上传
router.post('/upload', require('./actions/userAction/upload'));

// 退出登录
router.post('/logout', require('./actions/userAction/logout'));

module.exports = router;
