import { Request, Response } from 'express';

const login = (req: Request, res: Response) => {
  const { password, username } = req.body;
  if (password === '123456' && username === 'admin') {
    res.send({
      code: 0,
      message: 'successful',
      data: {
        nickname: 'admin',
        isAdmin: false,
        userId: 47,
        email: 'admin@kingnet.com',
        username: 'admin',
        token: '4aade192df48c64d0137e67fec9d07ea',
      },
    });
    return;
  }
  if (password === '123456' && username === 'user') {
    res.send({
      code: 0,
      message: 'successful',
      data: {
        nickname: 'user',
        isAdmin: false,
        userId: 66,
        email: 'user@kingnet.com',
        username: 'user',
        token: '4aade192df48c64d0137e67fec9d07ea',
      },
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
