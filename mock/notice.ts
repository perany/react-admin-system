import { Request, Response } from 'express';

const queryList = (req: Request, res: Response) => {
  res.send({
    code: 0,
    message: 'successful',
    data: {
      body: {
        data: [
          {
            readStatus: 1,
            createdAt: 1588764186000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37992,
            subject: 'Kafka导入[手游SDK导入-Test]提交审批申请, 请尽快处理!',
            id: 37992,
            to: '[12, 14, 15, 30, 73]',
            content: '\n应用: [10-数据开发组] \n申请人: 超级测试用户',
          },
          {
            readStatus: 0,
            createdAt: 1587901920000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37961,
            subject: '集群作业失败告警',
            id: 37961,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
          {
            readStatus: 0,
            createdAt: 1587373320000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37812,
            subject: '集群作业失败告警',
            id: 37812,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
          {
            readStatus: 0,
            createdAt: 1587368160000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37810,
            subject: '集群作业失败告警',
            id: 37810,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
          {
            readStatus: 0,
            createdAt: 1587368160000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37811,
            subject: '集群作业失败告警',
            id: 37811,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
          {
            readStatus: 0,
            createdAt: 1587368040000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37808,
            subject: '集群作业失败告警',
            id: 37808,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
          {
            readStatus: 0,
            createdAt: 1587368040000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37809,
            subject: '集群作业失败告警',
            id: 37809,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
          {
            readStatus: 0,
            createdAt: 1587124560000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37797,
            subject: '集群作业失败告警',
            id: 37797,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
          {
            readStatus: 0,
            createdAt: 1587120600000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37783,
            subject: '集群作业失败告警',
            id: 37783,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
          {
            readStatus: 0,
            createdAt: 1587120480000,
            msgOrign: '系统',
            sendId: 0,
            originId: 37782,
            subject: '集群作业失败告警',
            id: 37782,
            to: '[11, 2, 5, 12, 14, 24, 9, 35, 45, 15, 73, 30]',
            content: '集群作业[07656b2227c011ea808bfa163e2ecf4c-p2_a247_realtime_metrics]已停止',
          },
        ],
        page: { totalPage: 3, pageSize: 10, totalRows: 21, pageNum: 0 },
      },
    },
  });
};

const getCount = (req: Request, res: Response) => {
  res.send({
    code: 0,
    message: 'successful',
    data: '255',
  });
};

const successResult = {
  code: 0,
  message: 'successful',
  data: {},
};

export default {
  'GET /api/message/msgs': queryList,
  'GET /api/message/count': getCount,
  'GET /api/message/status/update': successResult,
  'GET /api/message/readed': successResult,
  'GET /api/message/config': {
    code: 0,
    message: 'successful',
    data: [{ name: '系统', id: 1 }],
  },
};
