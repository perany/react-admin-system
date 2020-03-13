import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import defaultSettings from '../../config/defaultSettings';

declare const ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: any;

// 保存用户信息
export function setUserInfo(data: any) {
  const { storageName } = defaultSettings;
  if (!window.localStorage) {
    // eslint-disable-next-line no-console
    console.log('浏览器不支持localstorage');
  }
  localStorage.setItem(storageName, JSON.stringify(data));
}

// 获取用户信息
export function getUserInfo() {
  if (!window.localStorage) {
    // eslint-disable-next-line no-console
    console.log('浏览器不支持localstorage');
    return {};
  }
  const { storageName } = defaultSettings;
  return JSON.parse(localStorage.getItem(storageName) || '{}');
}

// 更新用户信息
export function updateUserInfo(key: string, value: any) {
  const userInfo = getUserInfo();
  if (!userInfo[key]) {
    userInfo[key] = {};
  }
  userInfo[key] = value;
  setUserInfo(userInfo);
}

// 移除用户信息
export function removeUserInfo() {
  if (!window.localStorage) {
    // eslint-disable-next-line no-console
    console.log('浏览器不支持localstorage');
  }
  const { storageName } = defaultSettings;
  localStorage.removeItem(storageName);
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};
