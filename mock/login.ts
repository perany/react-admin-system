import { Request, Response } from 'express';

const login = (req: Request, res: Response) => {
  const { password, username, type } = req.body;
  if (password === '123456' && username === 'admin') {
    res.send({
      code: 0,
      message: 'successful',
      data: {
        nickname: 'test',
        isAdmin: false,
        userId: 47,
        email: 'zhangsan@kingnet.com',
        username: 'test',
        token: '4aade192df48c64d0137e67fec9d07ea',
      },
    });
    return;
  }
  if (password === '123456' && username === 'user') {
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'user',
    });
    return;
  }

  res.send({
    code: 13,
    message: 'error message',
    data: null,
  });
};

const logout = (req: Request, res: Response) => {
  res.send({
    code: 0,
    message: 'successful',
    data: null,
  });
};

export default {
  'POST /uniteservice/user/login': login,
  'GET /uniteservice/user/logout ': logout,
};
