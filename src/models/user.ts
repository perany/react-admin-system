import { Reducer, Effect } from 'umi';

import {
  getRoleInfo,
  messageCount,
  messageMsgs,
  msgConfig,
  msgReaded,
  msgStatusUpdate,
  query as queryUsers,
} from '@/services/user';
import { getUserInfo, updateUserInfo } from '@/utils/utils';
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
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchMessageCount: Effect;
    fetchMessageMsgs: Effect;
    fetchMessageReaded: Effect;
    fetchMessageUpdate: Effect;
    fetchMsgConfig: Effect;
    fetchRoleInfo: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    saveMessageCount: Reducer<UserModelState>;
    saveMessageMsgs: Reducer<UserModelState>;
    saveMsgConfig: Reducer<UserModelState>;
    saveRoleInfo: Reducer<UserModelState>;
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
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: getUserInfo(),
      });
    },
    // 未读消息数量
    *fetchMessageCount({ payload, callback }, { call, put }) {
      const response = yield call(messageCount, payload);
      yield put({
        type: 'saveMessageCount',
        payload: (response && response.code === 0 && response.data) || 0,
      });
      if (response && response.code === 0 && callback) callback(response);
    },
    // 用户消息列表
    *fetchMessageMsgs({ payload, callback }, { call, put }) {
      const response = yield call(messageMsgs, payload);
      yield put({
        type: 'saveMessageMsgs',
        payload: (response && response.code === 0 && response.data && response.data.body) || {},
      });
      if (response && response.code === 0 && callback) callback(response);
    },

    // 消息全部已读
    *fetchMessageReaded({ payload, callback }, { call }) {
      const response = yield call(msgReaded, payload);
      if (response && response.code === 0 && callback) callback(response);
    },

    // 单个消息已读
    *fetchMessageUpdate({ payload, callback }, { call }) {
      const response = yield call(msgStatusUpdate, payload);
      if (response && response.code === 0 && callback) callback(response);
    },

    // 消息来源
    *fetchMsgConfig({ payload, callback }, { call, put }) {
      const response = yield call(msgConfig, payload);
      yield put({
        type: 'saveMsgConfig',
        payload: (response && response.code === 0 && response.data) || [],
      });
      if (response && response.code === 0 && callback) callback(response);
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
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    saveMessageCount(state, { payload }) {
      return {
        ...state,
        msgCount: payload,
      };
    },
    saveMessageMsgs(state, { payload }) {
      return {
        ...state,
        msgData: payload,
      };
    },
    saveMsgConfig(state, { payload }) {
      return {
        ...state,
        msgConfig: payload,
      };
    },
    saveRoleInfo(state, { payload }) {
      return {
        ...state,
        roleInfo: payload,
      };
    },
  },
};

export default UserModel;
