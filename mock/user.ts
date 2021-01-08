import { Request, Response } from 'express';

function getFakeCaptcha(req: Request, res: Response) {
  return res.json('captcha-xxx');
}

const getRole = (req: Request, res: Response) => {
  const mapZhName = {
    '51': '用户', // 安全中心
    '41': '开发者', // 数据开发-测试
    '19': '管理员', // 数据中心管理
    '10': '超级管理员', // 数据开发组
    '-1': '超级管理员',
    '-2': '隐藏管理员',
  };
  const mapName = {
    '51': 'user', // 安全中心
    '41': 'developer', // 数据开发-测试
    '19': 'admin', // 数据中心管理
    '10': 'superAdmin', // 数据开发组
    '-1': 'superAdmin',
    '-2': 'hiddenAdmin',
  };
  const appID: any =
    req.headers['app-id'] && req.headers['app-id'] !== '0' ? req.headers['app-id'] : '19';
  return res.json({
    code: 0,
    message: 'successful',
    data: {
      roleId: 5,
      cnName: mapZhName[appID],
      name: mapName[appID],
    },
  });
};
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': (req: Request, res: Response) => {
    const { password, username, type } = req.body;
    if (password === 'ant.design' && username === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === 'ant.design' && username === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,

  'GET  /api/user/roleinfo': getRole,

  'GET /api/user/menu': {
    code: 0,
    message: 'successful',
    data: [
      {
        name: '欢迎页',
        path: '/welcome',
      },
      {
        name: '管理页',
        path: '/admin',
        routes: [
          {
            path: '/admin/sub1',
            name: '管理列表1',
          },
          // {
          //   path: '/admin/sub2',
          //   name: '管理列表2',
          // },
        ],
      },
      {
        name: '列表查询',
        path: '/list',
      },
      {
        name: '403',
        path: '/exception/403',
      },
      {
        name: '404',
        path: '/exception/404',
      },
    ],
  },

  'GET /api/user/crossToken': {
    code: 0,
    message: 'successful',
    data: {
      nickname: 'admin',
      userId: 47,
      email: 'admin@kingnet.com',
      username: 'admin',
      token: '4aade192df48c64d0137e67fec9d07ea',
    },
  },
};
