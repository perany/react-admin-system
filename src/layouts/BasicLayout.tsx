/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link, connect, Dispatch, history } from 'umi';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import PageLoading from '@/components/PageLoading';
import { ConnectState, Route } from '@/models/connect';
import { getAuthorityFromRouter, getRouteIcon } from '@/utils/utils';
import logo from '../assets/logo.png';
import NoAccessPage from '@/pages/403';
import NoFoundPage from '@/pages/404';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  menuLoading?: boolean;
}

/**
 * 前端管理菜单(从route.config.ts获取配置)
 * @param menuList
 */
// const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
//   menuList.map((item) => {
//     const localItem = {
//       ...item,
//       children: item.children ? menuDataRender(item.children) : [],
//     };
//     return Authorized.check(item.authority, localItem, null) as MenuDataItem;
//   });
//
// const getMenuData = (menuList: MenuDataItem[]): MenuDataItem[] => {
//   const result = menuDataRender(menuList);
//   console.log(99, result);
//   let newResult: MenuDataItem[] = [];
//   result.forEach((item) => {
//     newResult.push(item);
//     // newResult.push((undefined as unknown) as MenuDataItem);
//   });
//   return newResult;
// };

/**
 * 服务端下发菜单
 * @param menuList
 * @param routes
 */
const menuDataRender = (menuList: MenuDataItem[], routes: Route[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      icon: getRouteIcon(item.path || '', routes),
      children: item.children ? menuDataRender(item.children, routes) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    route: { routes },
    menuLoading,
  } = props;

  /**
   * init variables
   */
  const [authRoute, setAuthRoute] = useState<MenuDataItem[]>([] as MenuDataItem[]);
  useEffect(() => {
    if (dispatch) {
      // 获取菜单信息
      dispatch({
        type: 'user/getMenu',
        callback: (data: MenuDataItem[]) => {
          setAuthRoute(data);
        },
      });
      // 获取用户信息
      dispatch({
        type: 'user/fetchCurrent',
      });
      // 更新用户权限
      dispatch({
        type: 'user/fetchRoleInfo',
      });
    }
  }, []);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  // get authority
  let authority: any = true;
  if (location.pathname && location.pathname !== '/') {
    const serverAuthorized = getAuthorityFromRouter(
      authRoute,
      location?.pathname ?? '/',
      'menu',
    ) || {
      authority: 'noAccess',
    };
    authority = getAuthorityFromRouter(routes, location?.pathname ?? '/')
      ? serverAuthorized
      : { authority: 'noFound' };
  } else {
    // find first page path in serverRoute
    const findFirstRoute = (searchRoute: Route[]): string => {
      let name: string = searchRoute[0]?.path ?? '';
      if (searchRoute[0]?.routes) {
        name = findFirstRoute(searchRoute[0].routes);
      }
      return name;
    };
    // redirect to first page in serverRoute
    history.push({
      pathname: findFirstRoute(authRoute),
    });
  }
  const noAuthPage = authority!.authority === 'noAccess' ? <NoAccessPage /> : <NoFoundPage />;

  return (
    <ProLayout
      logo={logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, allRoutes, paths) => {
        const first = allRoutes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      // footerRender={() => defaultFooterDom}
      menuDataRender={() => menuDataRender(authRoute, routes as Route[])}
      // menuDataRender={getMenuData}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <ConfigProvider locale={zhCN}>
        <Authorized
          authority={authority!.authority}
          noMatch={menuLoading ? <PageLoading /> : noAuthPage}
        >
          {children}
        </Authorized>
      </ConfigProvider>
    </ProLayout>
  );
};

export default connect(({ global, settings, loading }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  menuLoading: loading.effects['user/getMenu'],
}))(BasicLayout);
