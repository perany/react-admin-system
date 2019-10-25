import request from '@/utils/request';
import {getAuthority} from "@/utils/authority";

export async function query() {
  return request('/api/users');
}

export async function login(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function getMenus() {
  return request("/api/menus", {
    method: "GET",
    params: {
      auth: getAuthority()
    }
  });
}
