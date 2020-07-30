import React from 'react';
import { PageHeader } from 'antd';
import { Link, history } from 'umi';

import back from './back.svg';
import styles from './index.less';

const PPageHeaderWrapper = ({
  children,
  backRoute,
  backName,
}: {
  children?: any;
  backRoute?: string;
  backName?: string;
}) => {
  // title text
  const titleDom = (
    <div className={styles.title}>
      <img src={back} style={{ cursor: 'pointer' }} alt="" />
      <span>{backName || ''}</span>
    </div>
  );
  // title wrap
  const wrapDom = backRoute ? (
    <Link to={backRoute} style={{ verticalAlign: 'super', marginRight: 16 }}>
      {titleDom}
    </Link>
  ) : (
    <a
      onClick={() => {
        history.goBack();
      }}
      style={{ verticalAlign: 'super', marginRight: 16 }}
    >
      {titleDom}
    </a>
  );

  return (
    <PageHeader
      breadcrumb={{}}
      title={wrapDom}
      className={styles.PPageHeaderWrapper}
      subTitle={null}
      footer={null}
    >
      {children}
    </PageHeader>
  );
};

export default PPageHeaderWrapper;
