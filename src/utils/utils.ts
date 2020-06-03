import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { history } from 'umi';
import defaultSettings from '../../config/defaultSettings';

declare const ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: any;

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

// 下划线转换驼峰
export const toHump = (name: string) => {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};

// 驼峰转换下划线
export const toLine = (name: string) => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**
 * 排序参数格式化
 * 对象或者对象数组 antd-table内传出的sorter
 * 转字符串 ‘update_at-ascend|name-descend’
 */
export const sortersToString = (sorters: any) => {
  if (!sorters) {
    return undefined;
  }
  const sortersArr: any = Array.isArray(sorters) ? [...sorters] : [sorters];
  sortersArr.map((item: any) => ({ [item.field]: item.order ? item.order : '' }));
  const result: any = [];
  sortersArr.forEach((item: any) => {
    if (item.order) {
      result.push(`${toLine(item.field)}-${item.order}`);
    }
  });
  return result.length > 0 ? result.join('|') : null;
};

/**
 * 排序参数格式化
 * 字符串‘update_at-ascend|name-descend’
 * 转成数组对象
 * [{ field: 'updateAt', order: 'ascend' },
 *  { field: 'name', order: 'descend' }]
 */
export const sortersToObject = (sortersString: any) => {
  if (!sortersString || sortersString === '') {
    return [];
  }
  return sortersString?.split('|').map((item: any) => ({
    field: toHump(item.split('-')[0]),
    order: item.split('-')[1],
  }));
};

// 获取表格列头
export const getColumns = (thead: any, keys: any, ...other: any[]) => {
  const columns =
    thead &&
    thead.map((item: any) => {
      const key = Object.keys(item) && Object.keys(item)[0];
      const value = item[key];
      const newItem = {
        title: value,
        dataIndex: key,
        ...keys[key],
      };
      // title extend
      if (keys[key]?.title) {
        newItem.title = [value, keys[key].title];
      }
      return newItem;
    });
  let result: any[] = [];
  if (columns) {
    result = other && other[0] ? [...columns, ...other] : [...columns];
  } else {
    result = other && other[0] ? [...other] : [];
  }
  return result;
};

// 固化查询参数至url
export const injectURLParams = (pathname: string, newQuery = {}, replace = false) => {
  const query: any = { ...newQuery };
  if (`${query.page}` === '1') {
    delete query.page;
  }
  const routeData = {
    pathname,
    query: {
      ...query,
    },
  };
  if (replace) {
    history.replace(routeData);
  } else {
    history.push(routeData);
  }
};

// 固化查询参数至url
export const updateURLParams = (params: any, isReplace?: boolean) => {
  const originalParams = isReplace ? {} : getPageQuery();
  injectURLParams(history.location.pathname, { ...originalParams, ...params }, true);
};

// 请求分页参数处理
export const requestPageFormat = (data: any) => {
  if (!data) {
    return {
      page: {
        pageNum: '',
        pageSize: '',
        orders: [],
      },
    };
  }
  const newData = { ...data };
  const params: any = {
    page: {
      pageNum: newData.current,
      pageSize: newData.pageSize,
      orders: [],
    },
  };
  // sort
  if (newData.sort?.length > 0) {
    const sortMap = {
      ascend: 'ASC',
      descend: 'DESC',
    };
    params.page.orders = newData.sort.split('|').map((item: any) => ({
      [item.split('-')[0]]: sortMap[item.split('-')[1]],
    }));
  }
  delete newData?.current;
  delete newData?.pageSize;
  delete newData?.sort;
  return {
    ...newData,
    ...params,
  };
};

// 列表分页参数：数据结构格式化
export const paginationFormat = (data: any): any => {
  if (!data || !data.body) {
    return {
      body: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      thead: [],
    };
  }
  return {
    body: [...data.body],
    pagination: {
      current: data.page ? data.page.pageNum : 1,
      pageSize: data.page ? data.page.pageSize : 10,
      total: data.page ? data.page.totalRows : 0,
    },
    thead: [...(data.thead || [])],
    total: data.page ? data.page.totalRows : 0,
  };
};

// 保存用户信息
export const setUserInfo = (data: any) => {
  const { storageName } = defaultSettings;
  if (!window.localStorage) {
    // eslint-disable-next-line no-console
    console.log('浏览器不支持localstorage');
  }
  localStorage.setItem(storageName, JSON.stringify(data));
};

// 获取用户信息
export const getUserInfo = () => {
  if (!window.localStorage) {
    // eslint-disable-next-line no-console
    console.log('浏览器不支持localstorage');
    return {};
  }
  const { storageName } = defaultSettings;
  return JSON.parse(localStorage.getItem(storageName) || '{}');
};

// 更新用户信息
export const updateUserInfo = (key: string, value: any) => {
  const userInfo = getUserInfo();
  if (!userInfo[key]) {
    userInfo[key] = {};
  }
  userInfo[key] = value;
  setUserInfo(userInfo);
};

// 移除用户信息
export const removeUserInfo = () => {
  if (!window.localStorage) {
    // eslint-disable-next-line no-console
    console.log('浏览器不支持localstorage');
  }
  const { storageName } = defaultSettings;
  localStorage.removeItem(storageName);
};

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

/**
 * props.route.routes   !!! match childs
 * @param router [{}]
 * @param pathname string
 * @param type
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
  type?: string,
): T | undefined => {
  const authority = router.find(({ routes, path = '/', target = '_self' }) => {
    // match url and children
    const matchChildren = pathRegexp(`${path}/(.*)`).exec(`${pathname}/`);
    // route level
    const level = path.match(/\/[a-zA-Z0-9]+/g)?.length || 1;
    return (
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname, type)) ||
      (type === 'menu' && // 判断菜单权限时：菜单无子路由 - 该路由的所有子路由有权限
        !routes &&
        matchChildren) ||
      (type === 'menu' && // 判断菜单权限时：三级或以上菜单路由 - 该路由的所有子路由有权限
        level >= 3 &&
        matchChildren)
    );
  });
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
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

export const getRouteIcon = (path: string, routeData: Route[]) => {
  let iconDom: any;
  routeData.forEach((route) => {
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.icon) {
        iconDom = route.icon;
      }
      if (route.path === path) {
        iconDom = route.icon || iconDom;
      }
      if (route.routes) {
        iconDom = getRouteIcon(path, route.routes) || iconDom;
      }
    }
  });
  return iconDom;
};
