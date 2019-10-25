import React, {Component} from "react";
import {connect} from "dva";
import {Alert} from "antd";
import router from "umi/router";
import Login from "@/components/Login";
import styles from "./Login.less";
import proxyConfig from "./../../../config/proxyConfig";

const loginErrorMap = new Map([
  [13, "用户授权失败"],
  [101, "用户不存在"],
  [102, "用户名或密码错误"],
  [106, "登陆错误次数过多，请稍后再试"],
  [110, "验证码类型错误"],
  [111, "账户类型错误"],
  [112, "用户已失效"],
  [114, "项目不存在"]
]);

const {Tab, UserName, Password, Captcha, Submit} = Login;

@connect(({login, menu, loading}) => ({
  login,
  menu,
  submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  state = {
    type: "oa",
    autoLogin: true,
    errorTip: ""
  };

  onTabChange = type => {
    this.setState({type});
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      const {type} = this.state;
      this.loginForm.validateFields(["username-" + type], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const {dispatch} = this.props;

          dispatch({
            type: "login/getCaptcha",
            payload: {
              username: values["username-" + type],
              source: type,
              projectId: proxyConfig.projectId,
              projectToken: proxyConfig.projectToken
            }
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const {type} = this.state;
    if (!err) {
      const {
        dispatch,
        route: {path, authority}
      } = this.props;
      dispatch({
        type: "login/login",
        payload: {
          username: values["username-" + type],
          password: values["password-" + type],
          verify_type: "token",
          source: type,
          code: values.code
        },
        callback: (res, url) => {
          if (res.code === 0) {
            // 更新菜单权限信息,服务端重新获取
            dispatch({
              type: "menu/getMenuData",
              payload: {path, authority}
            });
            router.replace(url);
          } else {
            this.setState({
              errorTip: loginErrorMap.get(res.code) || res.msg
            });
          }
        }
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked
    });
  };

  renderMessage = content => (
    <Alert
      style={{marginBottom: 24}}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const {login, submitting} = this.props;
    const {type, autoLogin, errorTip} = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="oa" tab={"OA账号"}>
            {login.status === "error" &&
            login.type === "oa" &&
            !submitting &&
            this.renderMessage("账户或密码错误")}
            <UserName
              name="username-oa"
              placeholder={`请输入OA账号`}
              addonAfter="@kingnet.com"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱"
                }
              ]}
            />
            <Password
              name="password-oa"
              placeholder={`请输入OA密码`}
              rules={[
                {
                  required: true,
                  message: "请输入密码"
                }
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
            {login.loginErrorTimes >= 3 && (
              <Captcha
                name="code"
                placeholder={"请输入验证码"}
                countDown={60}
                onGetCaptcha={this.onGetCaptcha}
                getCaptchaButtonText={"获取验证码"}
                getCaptchaSecondText={"秒"}
                rules={[
                  {
                    required: true,
                    message: "请输入验证码"
                  }
                ]}
              />
            )}
          </Tab>
          <Tab key="local" tab={"系统账号"}>
            {login.status === "error" &&
            login.type === "local" &&
            !submitting &&
            this.renderMessage("账户或密码错误")}
            <UserName
              name="username-local"
              placeholder={"请输入系统账号"}
              rules={[
                {
                  required: true,
                  message: "请输入系统账号"
                }
              ]}
            />
            <Password
              name="password-local"
              placeholder={"请输入系统密码"}
              rules={[
                {
                  required: true,
                  message: "请输入系统密码"
                }
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <div>
            {/*<Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>*/}
            {/*  记住我*/}
            {/*</Checkbox>*/}
            {/*<a style={{float: 'right'}} href="">*/}
            {/*  忘记密码*/}
            {/*</a>*/}
          </div>
          {errorTip && <div className={styles.errorTip}>{errorTip}</div>}
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
