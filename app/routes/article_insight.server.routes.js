var express = require('express')
var controller = require('../controllers/article_insight.server.controller')
var router = express.Router();

router.get('/', controller.showLanding);
router.get('/getData', controller.constructData);
router.get('/sign-in', controller.signIn);
router.get('/sign-out', controller.signOut);

router.get('/add-article', controller.showAddArticle);

router.post('/OverallAnalyticsControlPanel', controller.OverallAnalyticsControlPanel);
router.post('/IndividualArticleAnalyticsControlPanel', controller.IndividualArticleAnalyticsControlPanel);
router.post('/AuthorAnalyticsControlPanel', controller.AuthorAnalyticsControlPanel);


module.exports = router;