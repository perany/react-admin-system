import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
export default () => (
  <div style={{ paddingTop: 100, textAlign: 'center' }}>
    <ActivityIndicator size="large" />
  </div>
);
