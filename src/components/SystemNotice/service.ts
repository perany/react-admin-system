import request from '@/utils/request';
import proxyConfig from '../../../config/proxy.config';

const noticeServer = proxyConfig?.noticeServer ?? '';

// 未读消息数量
export async function messageCount(params?: any) {
  return request(`${noticeServer}/luna/message/count`, {
    params,
    data: {
      // mock: true,
    },
  });
}

// 用户消息列表
export async function messageMsgs(params: any) {
  return request(`${noticeServer}/luna/message/msgs`, {
    params,
    data: {
      // mock: true,
    },
  });
}

// 消息全部已读
export async function allMsgReaded(params: any) {
  return request(`${noticeServer}/luna/message/readed`, {
    params,
    data: {
      // mock: true,
    },
  });
}

// 单个消息已读
export async function msgStatusUpdate(params: any) {
  return request(`${noticeServer}/luna/message/status/update`, {
    params,
    data: {
      // mock: true,
    },
  });
}

// 消息来源
export async function msgConfig(params: any) {
  return request(`${noticeServer}/luna/message/config`, {
    params,
    data: {
      // mock: true,
    },
  });
}
