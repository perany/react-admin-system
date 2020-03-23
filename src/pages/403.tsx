import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

// 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, the page you visited does not have permission."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button>
    }
  />
);

export default NoFoundPage;
