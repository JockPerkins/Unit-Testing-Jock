const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const app = express();
const path = require('path')

const compiler = webpack(webpackConfig);

let sequelize = require('./models').sequelize;

let newsstories = require('./apis/newsstories');
app.use('/api/newsstories', newsstories);

let testapi = require('./apis/testapi');
app.use('/api/testapi', testapi);

let noapi = require('./apis/noapi');
app.use('/api/noapi', noapi);

app.use(express.static(__dirname + '/www'));

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));

app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'www', 'index.html'))
})

const server = app.listen(process.env.PORT || 8080, function() {
  const host = server.address().address || '0.0.0.0';
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
