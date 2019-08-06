import {Alert, Checkbox} from 'antd';
import React, {Component} from 'react';

import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {connect} from 'dva';
import {StateType} from '@/models/login';
import LoginComponents from '../../../components/Login';
import styles from './style.less';

const {Tab, UserName, Password, Mobile, Captcha, Submit} = LoginComponents;

interface LoginProps {
    dispatch: Dispatch<any>;
    userLogin: StateType;
    submitting: boolean;
}

interface LoginState {
    type: string;
    autoLogin: boolean;
}

export interface FromDataType {
    userName: string;
    password: string;
    mobile: string;
    captcha: string;
}

@connect(
    ({
         userLogin,
         loading,
     }: {
        userLogin: StateType;
        loading: {
            effects: {
                [key: string]: string;
            };
        };
    }) => ({
        userLogin,
        submitting: loading.effects['userLogin/login'],
    }),
)
class Login extends Component<LoginProps,
    LoginState> {
    loginForm: FormComponentProps['form'] | undefined | null = undefined;

    state: LoginState = {
        type: 'account',
        autoLogin: true,
    };

    changeAutoLogin = (e: CheckboxChangeEvent) => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };

    handleSubmit = (err: any, values: FromDataType) => {
        const {type} = this.state;
        if (!err) {
            const {dispatch} = this.props;
            dispatch({
                type: 'userLogin/login',
                payload: {
                    ...values,
                    type,
                },
            });
        }
    };

    onTabChange = (type: string) => {
        this.setState({type});
    };

    onGetCaptcha = () =>
        new Promise((resolve, reject) => {
            if (!this.loginForm) {
                return;
            }
            this.loginForm.validateFields(['mobile'], {}, (err: any, values: FromDataType) => {
                if (err) {
                    reject(err);
                } else {
                    const {dispatch} = this.props;
                    ((dispatch({
                        type: 'userLogin/getCaptcha',
                        payload: values.mobile,
                    }) as unknown) as Promise<any>)
                        .then(resolve)
                        .catch(reject);
                }
            });
        });

    renderMessage = (content: string) => (
        <Alert style={{marginBottom: 24}} message={content} type="error" showIcon/>
    );

    render() {
        const {userLogin, submitting} = this.props;
        const {status, type: loginType} = userLogin;
        const {type, autoLogin} = this.state;
        return (
            <div className={styles.main}>
                <LoginComponents
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    ref={(form: any) => {
                        this.loginForm = form;
                    }}
                >
                    <Tab key="account" tab={"账户密码登录"}>
                        {status === 'error' &&
                        loginType === 'account' &&
                        !submitting &&
                        this.renderMessage(
                            '账户或密码错误（admin/123456）',
                        )}
                        <UserName
                            name="userName"
                            placeholder={`用户名: admin or user`}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <Password
                            name="password"
                            placeholder={`密码: 123456`}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                            onPressEnter={e => {
                                e.preventDefault();
                                this.loginForm && this.loginForm.validateFields(this.handleSubmit);
                            }}
                        />
                    </Tab>
                    <Tab key="mobile" tab={'手机号登录'}>
                        {status === 'error' &&
                        loginType === 'mobile' &&
                        !submitting &&
                        this.renderMessage(
                            '验证码错误',
                        )}
                        <Mobile
                            name="mobile"
                            placeholder={'手机号'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入手机号！',
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '手机号格式错误！',
                                },
                            ]}
                        />
                        <Captcha
                            name="captcha"
                            placeholder={'验证码'}
                            countDown={120}
                            onGetCaptcha={this.onGetCaptcha}
                            getCaptchaButtonText={'获取验证码'}
                            getCaptchaSecondText={'秒'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码！',
                                },
                            ]}
                        />
                    </Tab>
                    <div>
                        <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                            自动登录
                        </Checkbox>
                        <a style={{float: 'right'}} href="">
                            忘记密码
                        </a>
                    </div>
                    <Submit loading={submitting}>
                        登录
                    </Submit>
                    {/*<div className={styles.other}>*/}
                    {/*  <FormattedMessage id="user-login.login.sign-in-with" />*/}
                    {/*  <Icon type="alipay-circle" className={styles.icon} theme="outlined" />*/}
                    {/*  <Icon type="taobao-circle" className={styles.icon} theme="outlined" />*/}
                    {/*  <Icon type="weibo-circle" className={styles.icon} theme="outlined" />*/}
                    {/*  <Link className={styles.register} to="/user/register">*/}
                    {/*    <FormattedMessage id="user-login.login.signup" />*/}
                    {/*  </Link>*/}
                    {/*</div>*/}
                </LoginComponents>
            </div>
        );
    }
}

export default Login;
