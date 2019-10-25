module.exports = {
  navTheme: 'dark', // theme for nav menu
  topNavTheme: false, // theme for top nav menu: dark,light,false
  resetTheme: {
    "primary-color": "#3188FF",
    "heading-color": "#1e2023", // 标题色
    "text-color": "#3f454a",// 主文本色
    "text-color-secondary": "#a9b0b8",// 次文本色
    "border-radius-base": "4px", // 组件/浮层圆角
    "border-color-base": "#e0e5ec", // 边框色
    "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)",// 浮层阴影
  }, // theme of ant design
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky header
  autoHideHeader: false, // auto hide header
  fixSiderbar: false, // sticky siderbar
  menu: {
    disableLocal: true,
  },
  title: '后台管理系统',
  pwa: false,
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: '',
};
