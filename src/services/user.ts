import request from '@/utils/request';
import { stringify } from 'qs';

export async function query(): Promise<any> {
  return request('/api/users');
}

// 获取用户角色
export async function getRoleInfo(params: any) {
  return request(`/api/user/roleinfo?${stringify(params)}`, {
    data: { mock: true },
  });
}

// 获取菜单信息
export async function getMenu(params: any) {
  return request(`/api/user/menu?${stringify(params)}`, {
    data: { mock: true },
  });
}
