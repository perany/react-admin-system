import { Reducer, Effect } from 'umi';
import { MenuDataItem } from '@ant-design/pro-layout';
import Cookies from 'js-cookie';

import {
  getRoleInfo,
  getMenu,
  query as queryUsers,
  getLocalInfoByCrossSystemToken,
} from '@/services/user';
import { getUserInfo, setUserInfo, updateUserInfo } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';

export interface CurrentUser {
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
  nickname?: string;
  username?: string;
  email?: string;
  token?: string;
  role?: string;
  userId?: any;
}

export interface RoleInfo {
  roleId?: string;
  cnName?: string;
  name?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  appId?: string;
  appName?: string;
  msgCount?: any;
  msgData?: any;
  msgConfig?: any[];
  roleInfo?: RoleInfo;
  moduleDataObj?: any;
  menu?: MenuDataItem[];
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchRoleInfo: Effect;
    getMenu: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveRoleInfo: Reducer<UserModelState>;
    saveMenu: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    msgCount: 0,
    msgData: {},
    msgConfig: [],
    roleInfo: {},
    menu: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { put, call }) {
      // get token from localStorage
      let localUserInfo = getUserInfo();
      // get token from cookie
      const cookieToken = Cookies.get('dataCenterCrossSystemToken');
      // check cookie token
      if (cookieToken !== undefined) {
        const response = yield call(getLocalInfoByCrossSystemToken, {
          token: cookieToken,
        });
        if (response?.code === 0 && response?.data) {
          // valid: exchange userinfo
          const exchangeInfo = response?.data ?? {};
          setUserInfo({
            ...localUserInfo,
            ...exchangeInfo,
          });
          localUserInfo = exchangeInfo;
          Cookies.remove('dataCenterCrossSystemToken');
        } else {
          // invalid: clear token
          delete localUserInfo?.token;
          setUserInfo(localUserInfo);
        }
      }
      // update state
      yield put({
        type: 'saveCurrentUser',
        payload: localUserInfo,
      });

      // JSSDK: dana 数据上报 - 生产环境
      if (
        ['prod'].indexOf(
          process.env.build_env ? process.env.build_env : process.env.NODE_ENV || 'dev',
        ) > -1 &&
        window.KINGNET_TRACK_SDK
      ) {
        window.KINGNET_TRACK_SDK.setProperties({
          openid: localUserInfo?.username || localUserInfo?.userId,
        });
      }
    },

    // 获取用户角色
    *fetchRoleInfo({ payload, callback }, { call, put }) {
      const response = yield call(getRoleInfo, payload);
      if (response && response.code === 0 && response.data) {
        // 更新用户角色
        const { cnName, name } = response.data;
        setAuthority(name);
        updateUserInfo('role', name);
        updateUserInfo('roleName', cnName);
        yield put({
          type: 'saveCurrentUser',
          payload: getUserInfo(),
        });
        // console.log("更新用户角色:", roleId, cnName, name);
      }
      yield put({
        type: 'saveRoleInfo',
        payload: (response && response.code === 0 && response.data) || {},
      });
      if (response && response.code === 0 && callback) callback(response);
    },

    // 获取菜单数据
    *getMenu({ payload, callback }, { call, put }) {
      const response = yield call(getMenu, payload);
      yield put({
        type: 'saveMenu',
        payload: (response && response.code === 0 && response.data) || [],
      });
      if (response && response.code === 0 && callback) callback(response?.data ?? []);
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: {
          ...((state && state.currentUser) || {}),
          ...(payload || {}),
        },
      };
    },
    saveRoleInfo(state, { payload }) {
      return {
        ...state,
        roleInfo: payload,
      };
    },
    saveMenu(state, { payload }) {
      return {
        ...state,
        menu: payload,
      };
    },
  },
};

export default UserModel;
