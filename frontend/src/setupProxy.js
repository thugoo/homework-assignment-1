const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
app.use(
    ['/api/**', '/static/drf-yasg/**', '/static/admin/**', '/static/rest_framework/**'],
    createProxyMiddleware({
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    })
  );
};