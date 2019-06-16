var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverArticleInsights = 'http://3.212.186.203:3001';

app.all("/article_insights/*", function(req, res) {
    console.log('redirecting to serverArticleInsights');
    apiProxy.web(req, res, {target: serverArticleInsights});
});

app.listen(3000);

