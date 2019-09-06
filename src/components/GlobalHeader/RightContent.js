import React, {PureComponent} from 'react';
import {Avatar, Icon, Menu, Spin} from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {

  render() {
    const {
      currentUser,
      onMenuClick,
      topNavTheme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user"/>
          个人中心
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting"/>
          账户设置
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout">
          <Icon type="logout"/>
          退出登录
        </Menu.Item>
      </Menu>
    );

    let className = styles.right;
    if (topNavTheme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.name ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              {currentUser.avatar ? <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              /> : <Avatar
                size="small"
                className={styles.avatar}
                icon={"user"}
                alt="avatar"
              />}
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{marginLeft: 8, marginRight: 8}}/>
        )}
      </div>
    );
  }
}
