var express = require('express');
var controller = require('../controllers/article_insight.login.controller');
var router = express.Router();

router.get('/login', controller.showPage);
router.get('/', controller.backPage);
router.post('/signup', controller.signUp);
router.post('/signin', controller.signIn)

module.exports = router;