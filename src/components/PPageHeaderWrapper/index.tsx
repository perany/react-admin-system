import React from 'react';
import { PageHeader } from 'antd';
import { history, Link } from 'umi';

import back from './back.svg';
import styles from './index.less';

const PPageHeaderWrapper = ({
  children,
  backRoute,
  backName,
  props,
  title,
}: {
  children?: any;
  backRoute?: string;
  backName?: string;
  title?: string;
  props?: any;
}) => {
  // title text
  let titleDom: any;
  if (title) {
    // no back but only title
    titleDom = (
      <div className={styles.title}>
        <span>{title}</span>
      </div>
    );
  } else {
    // title with back icon
    titleDom = (
      <div className={styles.title}>
        <img src={back} style={{ cursor: 'pointer' }} alt="" />
        <span>{backName || ''}</span>
      </div>
    );
  }

  // title Dom
  let wrapDom: any = titleDom;
  // back to route
  if (backRoute) {
    wrapDom = (
      <Link to={backRoute} style={{ verticalAlign: 'super', marginRight: 16 }}>
        {titleDom}
      </Link>
    );
  }
  // back to last page
  if (backName) {
    wrapDom = (
      <a
        onClick={() => {
          history.goBack();
        }}
        style={{ verticalAlign: 'super', marginRight: 16 }}
      >
        {titleDom}
      </a>
    );
  }

  return (
    <PageHeader
      breadcrumb={{}}
      title={wrapDom}
      className={styles.PPageHeaderWrapper}
      subTitle={null}
      footer={null}
      {...(props || {})}
    >
      {children}
    </PageHeader>
  );
};

export default PPageHeaderWrapper;
