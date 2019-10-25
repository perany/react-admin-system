import React from "react";
import Redirect from "umi/redirect";
import pathToRegexp from "path-to-regexp";
import {connect} from "dva";
import router from "umi/router";
import Authorized from "@/utils/Authorized";
import {getAuthority} from "@/utils/authority";
import Exception403 from "@/pages/Exception/403";

function AuthComponent({ children, location, routerData }) {
  const auth = getAuthority();
  const isLogin = auth && auth[0] !== "guest";
  //系统内所有页面都需要登录权限
  if (!isLogin) {
    router.push({pathname: "/user/login"});
  }

  const getRouteAuthority = (path, routeData) => {
    let authorities;
    routeData.forEach(route => {
      // match prefix
      if (pathToRegexp(`${route.path}(.*)`).test(path)) {
        // exact match
        if (route.path === path) {
          authorities = route.authority || authorities;
        }
        // get children authority recursively
        if (route.routes) {
          authorities = getRouteAuthority(path, route.routes) || authorities;
        }
      }
    });
    return authorities;
  };
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={isLogin ? <Exception403 /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
}

export default connect(({ menu: menuModel }) => ({
  routerData: menuModel.routerData
}))(AuthComponent);
