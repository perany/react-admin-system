// 根据环境变量设置服务器地址
const proxyConfig = {
  // CICD构建：研发环境
  dev: {
    postServer: "https://dev"
  },
  // CICD构建：生产环境
  prod: {
    postServer: "https://prod"
  },
  // 本地：研发环境（npm run start）, 开启mock时值为""
  development: {
    postServer: ""
  },
  // 本地：生产环境 (npm run buildProd)
  production: {
    postServer: "https://production"
  }
}[process.env.build_env ? process.env.build_env : process.env.NODE_ENV];

export default proxyConfig;
