import request from '@/utils/request';
import { stringify } from 'qs';

export async function query(): Promise<any> {
  return request('/api/users');
}

// 未读消息数量
export async function messageCount(params: any) {
  return request(`/kun/message/count?${stringify(params)}`);
}

// 用户消息列表
export async function messageMsgs(params: any) {
  return request(`/kun/message/msgs?${stringify(params)}`);
}

// 消息全部已读
export async function msgReaded(params: any) {
  return request(`/kun/message/readed?${stringify(params)}`);
}

// 单个消息已读
export async function msgStatusUpdate(params: any) {
  return request(`/kun/message/status/update?${stringify(params)}`);
}

// 消息来源
export async function msgConfig(params: any) {
  return request(`/kun/message/config?${stringify(params)}`);
}

// 获取用户角色
export async function getRoleInfo(params: any) {
  return request(`/kun/auth/roleinfo`, {
    data: { isMock: true },
  });
}
