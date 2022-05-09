const WebpackBar = require("webpackbar");

// 新版cra默认@babel/plugin-transform-react-jsx配置了automatic，需要重新配置才能走自己写的
// https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx#both-runtimes
module.exports = {
  webpack: {
    plugins: [
      // webpack构建进度条
      new WebpackBar({
        profile: true,
      }),
    ],
  },
  babel: {
    plugins: [["@babel/plugin-transform-react-jsx"]],
  },
  devServer: {
    port: 3002,
  },
};
