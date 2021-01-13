const router = require('express').Router();

// 搜索
router.get('/search/:key', require('./actions/public/search'));
// 获取题目列表 / 根据 id 获取题目
router.get('/questions', require('./actions/public/getQuestions'));
router.get('/questions/:_id', require('./actions/public/getQuestionById'));

// 根据题目 id 获取题解列表 / 根据 id 获取题解
router.get('/answers', require('./actions/public/getAnswers'));
router.get('/answers/:_id', require('./actions/public/getAnswerById'));
// 获取全部题解
router.get('/answersall', require('./actions/public/getAnswersAll'));


// 根据题解 id 获取题解评论 / 根据 id 获取题解评论
router.get('/comments', require('./actions/public/getComments'));
router.get('/comments/:_id', require('./actions/public/getCommentById'));

// 获取难度分类题解评论 / 根据 id 获取难度分类题解评论
router.get('/difficulties', require('./actions/public/getDifficulties'));
router.get('/difficulties/:_id', require('./actions/public/getDifficultyById'));

// 获取标签分类 / 根据 id 获取标签分类
router.get('/categories', require('./actions/public/getCategories'));
router.get('/categories/:_id', require('./actions/public/getCategoryById'));

// 注册
router.post('/register', require('./actions/public/register'));

// 获取验证码
router.get('/captcha', require('./actions/public/captcha'));

// 登录
router.post('/login', require('./actions/public/login'));

// 获取当前用户信息(jsonp)
router.get('/usersJsonp', require('./actions/public/getUsersJsonp'));

module.exports = router;