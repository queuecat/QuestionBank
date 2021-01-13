const router = require('express').Router();

// 中间件 - 登录拦截（用户行为拦截 + 更新 session）
router.use(require('../middleware/loginGuard'));

// 中间件 - 教师行为拦截
router.use(require('../middleware/teacherGuard'));

// 添加题目
router.post('/questions', require('./actions/teacher/postQuestions'));

// 删除题目
router.delete('/questions/:_id', require('./actions/teacher/deleteQuestions'));

// 修改题目
router.put('/questions/:_id', require('./actions/teacher/modifyQuestions'));

// 添加难度分类
router.post('/difficulties', require('./actions/teacher/postDifficulties'));

// 修改难度分类
router.put('/difficulties/:_id', require('./actions/teacher/modifyDifficulties'));

// 添加标签分类
router.post('/categories', require('./actions/teacher/postCategories'));

// 修改标签分类
router.put('/categories/:_id', require('./actions/teacher/modifyCategories'));

module.exports = router;
