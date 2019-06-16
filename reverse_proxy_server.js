// var express  = require('express');
// var app      = express();
// var httpProxy = require('http-proxy');
// var apiProxy = httpProxy.createProxyServer();
// var serverArticleInsights = 'http://3.212.186.203:3001';
//
// app.all("/article_insights/*", function(req, res) {
//     console.log('redirecting to serverArticleInsights');
//     apiProxy.web(req, res, {target: serverArticleInsights, changeOrigin: true});
// });
//
// app.listen(3000);
//

// const httpProxy = require('http-proxy');
// const http = require('http');
//
// const targetHost = 'www.google.co.uk';
//
// const proxy = httpProxy.createProxyServer({
//     target: 'http://' + targetHost
// });
//
// http.createServer(function (req, res) {
//     proxy.web(req, res);
//
// }).listen(3000);
//
// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//     proxyReq.setHeader('Host', targetHost);
// });

var proxy = require('express-http-proxy');
var app = require('express')();

app.use('/article-insights', proxy('http://3.212.186.203:3001'));
app.listen(3000, function () {
    console.log("listening on port 3000!");
})