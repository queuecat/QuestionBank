const router = require('express').Router();

// 中间件 - 登录拦截（用户行为拦截 + 更新 session）
router.use(require('../middleware/loginGuard'));

// 中间件 - 管理员行为拦截
router.use(require('../middleware/adminGuard'));

// 获取用户信息
router.get('/users', require('./actions/admin/getUsers'));

// 添加用户
router.post('/users', require('./actions/admin/postUsers'));

// 修改用户
router.put('/users/:_id', require('./actions/admin/modifyUsers'));

// 删除用户
router.delete('/users/:_id', require('./actions/admin/deleteUsers'));

// 根据 id 删除难度分类
router.delete('/difficulties/:_id', require('./actions/admin/deleteDifficulties'));

// 根据 id 删除标签分类
router.delete('/categories/:_id', require('./actions/admin/deleteCategories'));

// 根据 id 删除评论
router.delete('/comments/:_id', require('./actions/admin/deleteComments'));

module.exports = router;