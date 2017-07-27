const path = require('path');
const fs = require('fs-extra');
const open = require('open');
const context = require('./context.js');
const express = require('express');
const nunjucks = require('nunjucks');
const router = require('./router.js');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.js');

const app = express();
app.use('/', router);

app.set('view engine', 'html');
nunjucks.configure('./src/templates/', {
  autoescape: true,
  express: app,
  watch: true
})


module.exports = {
  startServer: (port) => {
    const compiler = webpack(webpackConfig);
    const middleware = webpackMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    });
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));

    app.listen(port, function() {
      app.keepAliveTimeout = 0;
    })

    middleware.waitUntilValid(() => {
      console.log(`app started on port ${port}`);
      open(`http://localhost:${port}`);
    });
  },
  renderIndex: () => {
    process.env.NODE_ENV = 'production';
    const ctx = context.getContext();

    app.render('index.html', ctx, function(err, html) {
      fs.writeFileSync('dist/index.html', html);
      console.log('dist/index.html written');
    })
  }
}