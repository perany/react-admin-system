// 根据环境变量设置服务器地址
export interface proxyConfigType {
  postServer: string;
  loginServer: string;
}

let proxyConfig: proxyConfigType;
switch (process.env.build_env ? process.env.build_env : process.env.NODE_ENV) {
  case "dev":
    // CICD构建：研发环境
    proxyConfig = {
      postServer: "https://dev",
      loginServer: "http://user.kdcservicedev.kyhub.cn"
    };
    break;
  case "prod":
    // CICD构建：生产环境
    proxyConfig = {
      postServer: "https://prod",
      loginServer: "http://user.kdcservice.kyhub.cn"
    };
    break;
  case "development":
    // 本地：研发环境（npm run start）
    proxyConfig = {
      postServer: "https://dev",
      loginServer: "http://user.kdcservicedev.kyhub.cn"
    };
    break;
  case "production":
    // 本地：生产环境 (npm run buildProd)
    proxyConfig = {
      postServer: "https://prod",
      loginServer: "http://user.kdcservicedev.kyhub.cn"
    };
    break;
  default:
    // 默认dev
    proxyConfig = {
      postServer: "https://dev",
      loginServer: "http://user.kdcservicedev.kyhub.cn"
    };
}

export default { ...proxyConfig };
