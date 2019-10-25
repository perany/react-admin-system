import {routerRedux} from "dva/router";
import {stringify} from "qs";
import {getCaptcha, login} from "@/services/login";
import {getAuthority, getUser, setAuthority, setUser} from "@/utils/authority";
import {getPageQuery} from "@/utils/utils";

let loginErrorTimes = localStorage.getItem("loginErrorTimes");
loginErrorTimes =
  typeof loginErrorTimes === "string" ? parseInt(loginErrorTimes) : 0;

export default {
  namespace: "login",

  state: {
    currentUser: getUser(),
    currentAuthority: getAuthority(),
    loginErrorTimes: loginErrorTimes
  },

  effects: {
    * login({payload, callback}, {call, put}) {
      const response = yield call(login, payload);
      const info = response.data || {};
      let redirect = "/";

      //登陆错误次数 更新
      loginErrorTimes = response.code === 0 ? 0 : loginErrorTimes + 1;
      localStorage.setItem("loginErrorTimes", loginErrorTimes + "");

      yield put({
        type: "changeLoginStatus",
        payload: {
          user: info,
          currentAuthority: info.currentAuthority,
          loginErrorTimes
        }
      });

      // Login successfully
      if (response.code === 0) {
        // redirect
        const urlParams = new URL(window.location.href);
        redirect = getPageQuery().redirect;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf("#") + 1);
            }
          } else {
            redirect = null;
          }
        }
        // yield put(routerRedux.replace(redirect || "/"));
      }
      callback ? callback(response, redirect || "/") : null;
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getCaptcha, payload);
    },

    * logout({}, {put}) {
      yield put({
        type: "changeLoginStatus",
        payload: {
          user: null,
          currentAuthority: "guest"
        }
      });
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== "/user/login" && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: "/user/login",
            search: stringify({
              redirect: window.location.href
            })
          })
        );
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const userInfo = payload.user
        ? {
          email: payload.user.email,
          name: payload.user.name,
          userId: payload.user.userId,
          username: payload.user.username,
          token: payload.user.token
        }
        : {};
      setUser(userInfo);
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        loginErrorTimes: payload.loginErrorTimes,
        currentUser: userInfo,
        currentAuthority: payload.currentAuthority
      };
    },
    saveCurrentUser(state, {payload}) {
      return {
        ...state,
        currentUser: payload || {}
      };
    }
  }
};
