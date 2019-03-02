var server = new WebpackDevServer(compiler, {
    contentBase: "/path/to/directory",
    //content-base 配置 
    hot: true,
    //开启 HMR，由 webpack-dev-server 发送 "webpackHotUpdate" 消息到客户端代码
    historyApiFallback: false,
    //单页应用 404 转向 index.html
    compress: true,
    //开启资源的 gzip 压缩
    proxy: {
      "**": "http://localhost:9090"
    },
    //代理配置，来源于 http-proxy-middleware
    setup: function(app) {
       //webpack-dev-server 本身是 Express 服务器可以添加自己的路由
      // app.get('/some/path', function(req, res) {
      //   res.json({ custom: 'response' });
      // });
    },
    //为 Express 服务器的 express.static 方法配置参数 http://expressjs.com/en/4x/api.html#express.static
    staticOptions: {
    },
    //在 inline 模式下用于控制在浏览器中打印的 log 级别，如`error`, `warning`, `info` or `none`.
    clientLogLevel: "info",
    //不在控制台打印任何 log
    quiet: false,
    //不输出启动 log
    noInfo: false,
    //webpack 不监听文件的变化，每次请求来的时候重新编译
    lazy: true,
    //文件名称
    filename: "bundle.js",
    //webpack 的 watch 配置，每隔多少秒检查文件的变化
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    //output.path 的虚拟路径映射
    publicPath: "/assets/",
    //设置自定义 http 头
    headers: { "X-Custom-Header": "yes" },
    //打包状态信息输出配置
    stats: { colors: true },
    //配置 https 需要的证书等
    https: {
      cert: fs.readFileSync("path-to-cert-file.pem"),
      key: fs.readFileSync("path-to-key-file.pem"),
      cacert: fs.readFileSync("path-to-cacert-file.pem")
    }
  });
  server.listen(8080, "localhost", function() {});
  // server.close();