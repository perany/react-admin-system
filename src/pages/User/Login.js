import React, {Component} from 'react';
import {connect} from 'dva';
import {formatMessage} from 'umi-plugin-react/locale';
import {Alert, Modal} from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const {Tab, UserName, Password, Captcha, Submit} = Login;

@connect(({login, loading}) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({type});
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const {dispatch} = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);

          Modal.info({
            title: formatMessage({id: 'app.login.verification-code-warning'}),
          });
        }
      });
    });

  handleSubmit = (err, values) => {
    const {type} = this.state;
    if (!err) {
      const {dispatch} = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          // type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{marginBottom: 24}} message={content} type="error" showIcon/>
  );

  render() {
    const {login, submitting} = this.props;
    const {type, autoLogin} = this.state;
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
          {/*<Tab key="account" tab={"域账号"}>*/}
          {login.status === 'error' &&
          login.type === 'account' &&
          !submitting &&
          this.renderMessage("账户或密码错误")}
          <UserName
            name="userName"
            placeholder={`邮箱: `}
            addonAfter="@kingnet.com"
            rules={[
              {
                required: true,
                message: "请输入邮箱",
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`密码: `}
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              this.loginForm.validateFields(this.handleSubmit);
            }}
          />
          {/*</Tab>*/}
          {/*<Tab key="mobile" tab={"合作企业"}>*/}
          {/*    {login.status === 'error' &&*/}
          {/*    login.type === 'mobile' &&*/}
          {/*    !submitting &&*/}
          {/*    this.renderMessage(*/}
          {/*        formatMessage({id: 'app.login.message-invalid-verification-code'})*/}
          {/*    )}*/}
          {/*    <UserName*/}
          {/*        name="userName"*/}
          {/*        placeholder={"用户名"}*/}
          {/*        rules={[*/}
          {/*            {*/}
          {/*                required: true,*/}
          {/*                message: formatMessage({id: 'validation.userName.required'}),*/}
          {/*            },*/}
          {/*        ]}*/}
          {/*    />*/}
          {/*    <Password*/}
          {/*        name="password"*/}
          {/*        placeholder={"密码"}*/}
          {/*        rules={[*/}
          {/*            {*/}
          {/*                required: true,*/}
          {/*                message: formatMessage({id: 'validation.password.required'}),*/}
          {/*            },*/}
          {/*        ]}*/}
          {/*        onPressEnter={e => {*/}
          {/*            e.preventDefault();*/}
          {/*            this.loginForm.validateFields(this.handleSubmit);*/}
          {/*        }}*/}
          {/*    />*/}
          {/*    <Captcha*/}
          {/*        name="captcha"*/}
          {/*        placeholder={'验证码'}*/}
          {/*        countDown={120}*/}
          {/*        onGetCaptcha={this.onGetCaptcha}*/}
          {/*        getCaptchaButtonText={'获取验证码'}*/}
          {/*        getCaptchaSecondText={'秒'}*/}
          {/*        rules={[*/}
          {/*          {*/}
          {/*            required: true,*/}
          {/*            message: formatMessage({ id: 'validation.verification-code.required' }),*/}
          {/*          },*/}
          {/*        ]}*/}
          {/*    />*/}
          {/*</Tab>*/}
          <div>
            {/*<Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>*/}
            {/*  记住我*/}
            {/*</Checkbox>*/}
            {/*<a style={{float: 'right'}} href="">*/}
            {/*  忘记密码*/}
            {/*</a>*/}
          </div>
          <Submit loading={submitting}>
            登录
          </Submit>
          {/*<div className={styles.other}>*/}
          {/*  <FormattedMessage id="app.login.sign-in-with" />*/}
          {/*  <Icon type="alipay-circle" className={styles.icon} theme="outlined" />*/}
          {/*  <Icon type="taobao-circle" className={styles.icon} theme="outlined" />*/}
          {/*  <Icon type="weibo-circle" className={styles.icon} theme="outlined" />*/}
          {/*</div>*/}
        </Login>
      </div>
    );
  }
}

export default LoginPage;
