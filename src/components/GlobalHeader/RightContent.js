import React, {PureComponent} from 'react';
import {ActivityIndicator, Icon, Menu} from 'antd-mobile';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {

  render() {
    const {
      currentUser,
      onMenuClick,
      theme,
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
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.name ? (
          <span className={`${styles.action} ${styles.account}`}>
              <img
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
        ) : (
          <ActivityIndicator size="small" style={{marginLeft: 8, marginRight: 8}}/>
        )}
      </div>
    );
  }
}
