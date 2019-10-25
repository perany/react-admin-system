import pathToRegexp from 'path-to-regexp';
import {addRule, queryRule, removeRule, updateRule} from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
      query: {},
    },
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'saveQuery',
        payload,
      });
    },
    * add({payload, callback}, {call, put}) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({payload, callback}, {call, put}) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * update({payload, callback}, {call, put}) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, {payload}) {
      const {list, pagination} = payload;
      return {
        ...state,
        data: {
          list,
          pagination,
        },
      };
    },
    saveQuery(state, action) {
      const {data} = state;
      return {
        ...state,
        data: {
          ...data,
          query: action.payload
        }
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen((location) => {
        const articleUrlRegexp = pathToRegexp('/list/table-list');
        if (articleUrlRegexp.test(location.pathname)) {
          const match = pathToRegexp('/list/table-list').exec(location.pathname);
          const payload = location.query;
          dispatch({
            type: 'fetch',
            payload: {
              id: 1,
              // module_id: match[2],
              ...payload
            },
          });
        }
      });
    },
    // selectType({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     const articleCreateUrl = '/application/:application_id/articleManagement/:module_id/create';
    //     const articleCreateUrlRegexp = pathToRegexp(articleCreateUrl);
    //     const articleUpdateUrl = '/application/:application_id/articleManagement/:module_id/article/:article_id/update';
    //     const articleUpdateUrlRegexp = pathToRegexp(articleUpdateUrl);
    //     let match = null;
    //     if (articleCreateUrlRegexp.test(pathname)) {
    //       match = pathToRegexp(articleCreateUrl).exec(pathname);
    //     } else if (articleUpdateUrlRegexp.test([pathname])) {
    //       match = pathToRegexp(articleUpdateUrl).exec(pathname);
    //     }else{
    //       return
    //     }
    //     dispatch({
    //       type: 'module/view',
    //       payload: {
    //         application_id: match[1],
    //         id: match[2],
    //       },
    //       callback: (data) => {
    //         dispatch({
    //           type: 'type',
    //           payload: data.type,
    //         });
    //       },
    //     });
    //   });
    // },
  },
};
