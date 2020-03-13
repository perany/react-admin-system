import request from '@/utils/request';
import { stringify } from 'qs';
import proxyConfig from '../../config/proxy.config';

export async function fakeAccountLogin(params: any) {
  return request(`${proxyConfig.loginServer}/userservice/user/login`, {
    method: 'POST',
    data: {
      ...params,
      // isMock: true
    },
  });
}

// 退出登录
export async function accountLoginOut(params: any) {
  return request(`${proxyConfig.loginServer}/userservice/user/logout?${stringify(params)}`);
}
