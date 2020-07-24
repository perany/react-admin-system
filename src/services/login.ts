import request from '@/utils/request';

export async function fakeAccountLogin(params: any) {
  return request(`/uniteservice/user/login`, {
    method: 'POST',
    data: {
      ...params,
      mock: true,
      login: true,
    },
  });
}

// 退出登录
export async function accountLoginOut(params: any) {
  return request(`/uniteservice/user/logout`, {
    method: 'GET',
    data: {
      ...params,
      mock: true,
      login: true,
    },
  });
}
