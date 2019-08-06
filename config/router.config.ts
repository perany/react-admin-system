export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      // { path: '/user/register', name: 'register', component: './User/Register' },
      // {
      //     path: '/user/register-result',
      //     name: 'register.result',
      //     component: './User/RegisterResult',
      // },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
      }, //test
      {
        name: 'KingRC Demo',
        icon: 'check-circle-o',
        path: '/test',
        component: './Test/KingrcTest',
      },
      {
        component: './404',
      },
    ],
  },
];
