// https://umijs.org/config/
// import os from "os";
import path from 'path';
import pageRoutes from "./router.config";
import defaultSettings from "./defaultSettings";
// import slash from "slash2";

const {pwa, title, primaryColor} = defaultSettings;
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const {NODE_ENV, build_env, MOCK} = process.env;

const plugins = [
  [
    "umi-plugin-react",
    {
      antd: true,
      dva: {
        hmr: true
      },
      title: {
        defaultTitle: title,
      },
      locale: {
        enable: true, // default false
        default: "zh-CN", // default zh-CN
        baseNavigator: true // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: "./components/PageLoading/index",
        webpackChunkName: true,
        level: 2
      },
      pwa: pwa
        ? {
          workboxPluginMode: "InjectManifest",
          workboxOptions: {
            importWorkboxFrom: "local"
          }
        }
        : false,
      dll: false,
      hd: false,
      fastClick: true,
      hardSource: false,
    }
  ]
];

export default {
  // add for transfer to umi
  plugins,
  define: {
    "process.env": {
      build_env: build_env,
      MOCK: MOCK,
      NODE_ENV: NODE_ENV
    }
  },
  treeShaking: true,
  targets: {
    android: 5,
    chrome: 58,
    edge: 13,
    firefox: 45,
    ie: 9,
    ios: 7,
    safari: 10,
  },
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  devtool:
    NODE_ENV === "development" && build_env !== "prod" ? "source-map" : false,
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  theme: {
    'brand-primary': primaryColor,
    "primary-color": primaryColor,
    'brand-primary-tap': primaryColor,
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  disableRedirectHoist: true,
  cssnano: {
    mergeRules: false,
  },
  manifest: {
    basePath: "/"
  },
  outputPath: "./release",
  publicPath: "./",
  // base: "./",
  hash: true,
  history: "hash",
  // chainWebpack: webpackPlugin
};
