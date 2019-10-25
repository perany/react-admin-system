export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/list/table-list' },
      // list
      {
        path: '/list',
        icon: 'table',
        name: '列表',
        routes: [
          {
            path: '/list/table-list',
            name: '查询列表',
            component: './List/TableList',
          },
          {
            path: '/list/detail/:id',
            hideInMenu: true,
            name: '详情',
            component: './List/Detail',
          },
        ],
      },
      //test
      {
        name: '测试页面',
        icon: 'check-circle-o',
        path: '/test',
        authority: ["admin"],
        component: './Test/KingrcTest',
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
