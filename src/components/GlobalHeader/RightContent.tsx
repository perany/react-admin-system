import { Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectProps } from 'umi';
import { ConnectState } from '@/models/connect';
import SystemNotice from '@/components/SystemNotice';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
  notice: boolean;
  helpPage: any;
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, notice, helpPage } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  // help link
  const helpDom = helpPage?.link && (
    <Tooltip title={helpPage?.tooltip ?? '帮助文档'}>
      <a target="_blank" href={helpPage?.link} rel="noopener noreferrer" className={styles.action}>
        <QuestionCircleOutlined />
      </a>
    </Tooltip>
  );

  return (
    <div className={className}>
      {helpDom}
      {notice && <SystemNotice />}
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  notice: settings.notice,
  helpPage: settings.helpPage,
}))(GlobalHeaderRight);
