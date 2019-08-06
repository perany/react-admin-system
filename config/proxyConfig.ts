// 根据环境变量设置服务器地址
let url = '';
switch (process.env.build_env ? process.env.build_env : process.env.NODE_ENV) {
    case 'dev':
        // CICD构建：研发环境
        url = "https://dev";
        break;
    case 'prod':
        // CICD构建：生产环境
        url = "https://prod";
        break;
    case 'development':
        // 本地：研发环境（npm run start）
        url = "https://dev";
        break;
    case 'production':
        // 本地：生产环境 (npm run buildProd)
        url = "https://localhost:8080";
        break;
}
let proxyConfig = {postServer: url};

export default proxyConfig;
