import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { accountLoginOut, fakeAccountLogin } from '@/services/login';
import { removeUserInfo, setUserInfo, getPageQuery } from '@/utils/utils';
import { message } from 'antd';

export interface LoginModelState {
  status?: boolean;
  type?: any;
}

export interface LoginModelType {
  namespace: string;
  state: LoginModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<{}>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          ...response,
          status: payload.code === 0,
        },
      });
      if (callback && response && response.code === 0) callback(response);
      // Login successfully
      if (response && response.code === 0) {
        const user = response.data ? response.data : {};
        // 更新用户信息
        setUserInfo(user);

        // JSSDK: dana 数据上报 - 生产环境
        if (
          ['prod'].indexOf(
            process.env.build_env ? process.env.build_env : process.env.NODE_ENV || 'dev',
          ) > -1 &&
          window.KINGNET_TRACK_SDK
        ) {
          window.KINGNET_TRACK_SDK.setProperties({
            openid: user?.username || user?.userId,
          });
        }

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      } else {
        message.error(response?.message || '登录失败');
      }
    },
    *logout(state, { call }) {
      const paramsOut = {
        // userId: getUserInfo().userId,
        // projectId: defaultSettings.projectId,
      };
      yield call(accountLoginOut, paramsOut);
      removeUserInfo();

      // JSSDK: dana 数据上报 - 生产环境
      if (
        ['prod'].indexOf(
          process.env.build_env ? process.env.build_env : process.env.NODE_ENV || 'dev',
        ) > -1 &&
        window.KINGNET_TRACK_SDK
      ) {
        window.KINGNET_TRACK_SDK.setProperties({
          openid: '',
        });
      }

      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
