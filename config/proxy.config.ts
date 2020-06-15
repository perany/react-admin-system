// 根据环境变量设置服务器地址
export interface proxyConfigType {
  // 接口服务域名
  postServer: string;
  // 用户服务域名（登录、登出、权限等）
  loginServer: string;
  // 项目ID
  projectId: string;
  // 登录密码加密串
  encryptKey: string;
  // 消息服务域名
  noticeServer?: string;
}

let proxyConfig: proxyConfigType;
switch (process.env.build_env ? process.env.build_env : process.env.NODE_ENV) {
  case 'dev':
    // CICD构建：研发环境
    proxyConfig = {
      postServer: 'https://dev.cn',
      loginServer: 'http://login.cn',
      noticeServer: '',
      projectId: '',
      encryptKey: '1d0d94042fa2c8e9f521cd1e798a85fd',
    };
    break;
  case 'prod':
    // CICD构建：生产环境
    proxyConfig = {
      postServer: 'https://prod',
      loginServer: 'http://login.cn',
      noticeServer: '',
      projectId: '',
      encryptKey: '794c2bc6dff894358b75e25aae09def3',
    };
    break;
  case 'development':
    // 本地：研发环境（npm run start）
    proxyConfig = {
      postServer: 'https://dev.cn',
      loginServer: 'http://login.cn',
      noticeServer: '',
      projectId: '',
      encryptKey: '1d0d94042fa2c8e9f521cd1e798a85fd',
    };
    break;
  case 'production':
    // 本地：生产环境 (npm run buildProd)
    proxyConfig = {
      postServer: 'https://prod',
      loginServer: 'http://login.cn',
      noticeServer: '',
      projectId: '',
      encryptKey: '794c2bc6dff894358b75e25aae09def3',
    };
    break;
  default:
    // 默认dev
    proxyConfig = {
      postServer: 'https://dev.cn',
      loginServer: 'http://login.cn',
      noticeServer: '',
      projectId: '',
      encryptKey: '794c2bc6dff894358b75e25aae09def3',
    };
}

export default { ...proxyConfig };
