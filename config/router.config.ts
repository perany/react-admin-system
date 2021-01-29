export default [
  {
    path: '/user',
    component: '../layouts/BlankLayout',
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './Login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // Routes: ['src/pages/Authorized'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: '欢迎页',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/admin',
            name: '管理页',
            icon: 'crown',
            routes: [
              {
                path: '/admin',
                redirect: '/admin/list',
              },
              {
                path: '/admin/list',
                component: './Admin',
              },
              {
                path: '/admin/sub1',
                name: '管理列表1',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/admin/sub2',
                name: '管理列表2',
                icon: 'smile',
                component: './Welcome',
              },
            ],
          },
          {
            name: '列表查询',
            icon: 'table',
            path: '/list',
            component: './ListTable',
          },
          {
            path: '/exception',
            routes: [
              {
                path: '/exception/403',
                component: './403',
              },
              {
                path: '/exception/404',
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
