// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import pageRoutes from './router.config';

const { REACT_APP_ENV, build_env, NODE_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  title: false,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: pageRoutes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    'process.env': {
      NODE_ENV: NODE_ENV,
      build_env: build_env,
    },
  },
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  outputPath: './release',
  publicPath: './',
  history: { type: 'hash' },
  extraBabelPlugins: [
    ['production', 'prod'].includes((build_env ? build_env : NODE_ENV) as string)
      ? 'transform-remove-console'
      : '',
  ],
});
