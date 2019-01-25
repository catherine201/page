const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/article', {
      target: 'http://192.168.1.162:9010/',
      changeOrigin: true,
      pathRewrite: {
        '^/article': ''
      }
    })
  );
  app.use(
    proxy('/log', {
      target: 'http://192.168.1.162:9000/',
      changeOrigin: true,
      pathRewrite: {
        '^/log': ''
      }
    })
  );
  app.use(
    proxy('/third', {
      target: 'http://192.168.1.189:3030/',
      changeOrigin: true,
      pathRewrite: {
        '^/third': ''
      }
    })
  );
  app.use(
    proxy('/oss', {
      target: 'http://wwwblockchain.oss-cn-shenzhen.aliyuncs.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/oss': ''
      }
    })
  );
};
