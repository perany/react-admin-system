import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {Icon, Menu} from 'antd';
import {urlToList} from '../_utils/pathTools';
import {getMenuMatches} from '@/components/SiderMenu/SiderMenuUtils';
import {isUrl} from '@/utils/utils';
import styles from './index.less';
import IconFont from '@/components/IconFont';

const {SubMenu} = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon}/>}/>;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon}/>;
    }
    return <Icon type={icon}/>;
  }
  return icon;
};

export default class TopBaseMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const {flatMenuKeys} = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const {name} = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const {name} = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const {target} = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <a onClick={() => this.setHeaderMenu(itemPath)}>
        {icon}
        <span>{name}</span>
      </a>
    );
  };


  setHeaderMenu = itemPath => {
    const {selectedHeaderMenu, dispatch} = this.props;
    if (selectedHeaderMenu !== itemPath) {
      dispatch({
        type: 'menu/setHeaderMenu',
        payload: {
          selectedHeaderMenu: itemPath
        }
      });
    }
  }


  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  getPopupContainer = (fixedHeader, layout) => {
    if (fixedHeader && layout === 'topmenu') {
      return this.wrap;
    }
    return document.body;
  };

  getRef = ref => {
    this.wrap = ref;
  };

  render() {
    const {
      topNavTheme,
      mode,
      className,
      fixedHeader,
      layout,
      selectedHeaderMenu,
      maxWidth,
    } = this.props;


    const {handleOpenChange, style, menuData} = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <>
        <Menu
          key="Menu"
          mode={mode}
          theme={topNavTheme}
          onOpenChange={handleOpenChange}
          selectedKeys={[selectedHeaderMenu]}
          style={{...style, width: maxWidth}}
          className={cls}
          getPopupContainer={() => this.getPopupContainer(fixedHeader, layout)}
        >
          {this.getNavMenuItems(menuData)}
        </Menu>
        <div ref={this.getRef}/>
      </>
    );
  }
}
