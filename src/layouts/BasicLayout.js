import React, {Component} from 'react';
import NProgress from 'nprogress';
import withRouter from 'umi/withRouter';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'dva';
import styles from './index.less';
import '@/layouts/nprogress.less';

NProgress.configure({showSpinner: false});

let currHref = '';

class BasicLayout extends Component {

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
    dispatch({
      type: 'menu/getMenuData',
      payload: {routes, path, authority},
    });
  }


  render() {
    const {
      children,
      loading,
      location: {pathname},
      route: {routes},
    } = this.props;
    const {href} = window.location; // 浏览器地址栏中地址
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
      <ReactCSSTransitionGroup
        transitionName="transitionWrapper"
        component="div"
        className={styles.transitionWrapper}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        <div key={pathname} style={{position: 'absolute', width: '100%', height: '100%'}}>
          {children}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

export default withRouter(connect(({app, loading, menu: menuModel, setting}) => ({
  app,
  loading,
  menuData: menuModel.menuData,
  ...setting
}))(BasicLayout));
