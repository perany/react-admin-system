/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message, Modal, notification } from 'antd';
import { getDvaApp } from 'umi';

import { getUserInfo } from '@/utils/utils';
import proxyConfig from '../../config/proxy.config';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 登录失效错误弹窗
const showErrorModal = (title: string, content: string, reLogin: boolean) => {
  // 避免多个接口报错同时出现多个弹窗
  const modalLength = document.getElementsByClassName('ant-modal-confirm-error');
  const noModal = modalLength && modalLength.length < 1;
  if (!noModal) {
    return;
  }
  Modal.error({
    title,
    content,
    onOk: () => {
      if (reLogin) {
        // eslint-disable-next-line no-underscore-dangle
        getDvaApp()._store.dispatch({
          type: 'login/logout',
        });
      }
    },
  });
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response?.status && response?.status > 200) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
});

// request interceptor, change url or options.
request.interceptors.request.use((url: string, options: any) => {
  // access check
  const user = getUserInfo();
  const newParams = {
    ...options.params,
  };
  let newHeaders = {
    ...options.headers,
  };
  const newData = {
    ...(options.data || {}),
  };
  const newOption = {
    ...options,
  };
  // headers
  if (user && user.token && user.userId) {
    // newParams = { ...options.params, token: user.token };
    newHeaders = {
      ...options.headers,
      'Kdc-Token': user.token,
      'User-Id': user.userId,
    };
  }
  // url
  let newUrl = url;
  const isAbsoluteURL = url.substr(0, 4) === 'http';
  // relative url add prefix
  if (!isAbsoluteURL) {
    newUrl = proxyConfig.postServer + newUrl;
  }
  // login api
  if (options.data && options.data.login) {
    newUrl = proxyConfig.loginServer + url;
    newOption.interceptors = false;
    delete newData.login;
  }
  // mock
  const { mock } = options.data || {};
  if (mock !== undefined) {
    delete newData.mock;
  }
  if (mock) newUrl = url;
  // proxy match 前端实现生产环境多代理转发配置
  // if (proxyConfig.proxy) {
  //   Object.keys(proxyConfig.proxy).forEach(value => {
  //     if (new RegExp("^" + value, 'g').test(path)) {
  //       url = proxyConfig.proxy[value] + path;
  //     }
  //   })
  // }
  return {
    options: {
      ...newOption,
      interceptors: newOption.interceptors !== false,
      headers: newHeaders,
      params: newParams,
      data: newData,
    },
    url: newUrl,
  };
});

// response interceptor, handling response
request.interceptors.response.use(async (response, options: any) => {
  // file download
  if (
    ['application/zip', 'application/octet-stream'].includes(
      response.headers.get('Content-Type') ?? '',
    )
  ) {
    // 将文件流转为blob对象，并获取本地文件链接
    response.blob().then((blob) => {
      const a = window.document.createElement('a');
      const downUrl = window.URL.createObjectURL(blob); // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      const fileStr = response.headers.get('Content-Disposition') || '';
      let filename = fileStr.split('filename=')[1] || '';
      filename = filename.substr(0, filename.length);
      a.href = downUrl;
      a.download = decodeURIComponent(filename);
      a.click();
      window.URL.revokeObjectURL(downUrl);
    });
    return response;
  }

  // json response
  const res = await response.clone().json();
  if (res?.code === 0) {
    return response;
  }

  // 接口错误
  if (res?.code === 211) {
    // 如果账户是失效账户，直接重新登录
    showErrorModal('登录信息异常，请重新登录', res?.message, true);
  } else if (res.code === 310) {
    // 接口没有权限
    showErrorModal('当前用户没有权限', res?.message, false);
  } else if (options.interceptors && res?.code !== 0) {
    message.error(res?.message || `请求错误：${res?.code ?? '未知'}`);
  }

  return response;
});

export default request;
