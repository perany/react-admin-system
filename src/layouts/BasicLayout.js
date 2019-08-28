import React from 'react';
import {connect} from 'dva';
import NProgress from 'nprogress';

NProgress.configure({showSpinner: false});

let currHref = '';

class BasicLayout extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      route: {routes, path, authority},
    } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    // dispatch({
    //   type: 'menu/getMenuData',
    //   payload: {routes, path, authority},
    // });
  }

  getContext() {
    const {location, breadcrumbNameMap} = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  render() {
    const {
      children,
      loading
    } = this.props;
    const {href} = window.location;

    if (currHref !== href) {
      // currHref 和 href 不一致时说明进行了页面跳转
      NProgress.start(); // 页面开始加载时调用 start 方法
      if (!loading.global) {
        // loading.global 为 false 时表示加载完毕
        NProgress.done(); // 页面请求完毕时调用 done 方法
        currHref = href; // 将新页面的 href 值赋值给 currHref
      }
    }

    return (
      <div>{children}</div>
    );
  }
}

export default connect(({global, setting, loading}) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  loading,
  ...setting,
}))(BasicLayout);
