import React, { Component } from 'react';
import { Tabs, Row, Col, Form, message, Button, Input, Checkbox } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { LoginModelState } from '@/models/login';
import styles from './index.less';

const displayName = 'LoginFrom';

const tabs = [
  {
    tab: '域帐号',
    key: 'domain',
    content: '域帐号',
    source: 'oa',
  },
  {
    tab: '系统账号',
    key: 'partner',
    content: '系统账号',
    source: 'local',
  },
];

const config = [
  {
    label: '账号',
    component: 'Input',
    componentProps: {
      placeholder: '账号',
      size: 'large',
      maxLength: 20,
      style: {
        // width: '320px',
        borderRadius: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        borderColor: '#ebedf2',
      },
    },
    formBinderProps: {
      name: 'name',
      rules: [
        {
          required: true,
          message: '请输入账号!',
        },
      ],
    },
  },
  {
    label: '密码',
    component: 'Input',
    componentProps: {
      placeholder: '密码',
      type: 'password',
      style: {
        // width: '320px',
        borderRadius: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        borderColor: '#ebedf2',
      },
    },
    formBinderProps: {
      name: 'password',
      rules: [
        {
          required: true,
          message: '请输入密码!',
        },
      ],
    },
  },
  // {
  //   label: '记住我',
  //   component: 'Checkbox',
  //   componentProps: {
  //     defaultChecked: true,
  //   },
  //   formBinderProps: {
  //     name: 'remember',
  //     initialValue: true,
  //   },
  // },
  {
    label: '登录',
    component: 'Button',
    componentProps: {
      type: 'primary',
      style: {
        width: '100%',
      },
      htmlType: 'submit',
    },
  },
];

interface configItem {
  label: string;
  component: string;
  componentProps: any;
  formBinderProps: {
    name: string;
    rules?: any;
    initialValue?: any;
  };
}

interface LoginFromProps {
  dispatch?: Dispatch<any>;
}

@connect(
  ({
    login,
    loading,
  }: {
    login: LoginModelState;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    login,
    submitting: loading.effects['login/login'],
  }),
)
class LoginFrom extends Component<LoginFromProps> {
  static displayName = displayName;

  state = {
    source: 'oa',
  };

  loginSuccessCallback = async () => {
    // 获取权限列表
    // 保存cookie 数据
    // setUserInfo(data);
  };

  onTabChange = (key: string) => {
    this.setState({
      source: key,
    });
  };

  onSubmit = (values: any) => {
    const { dispatch } = this.props;
    const { source } = this.state;
    // console.log('login submit', values);
    if (dispatch) {
      dispatch({
        type: 'login/login',
        payload: {
          username: values.name,
          password: values.password,
          source,
        },
      });
    }
  };

  onSubmitFailed = (error: any) => {
    message.error(error);
  };

  renderButton = (item: configItem) => {
    const props: any = item.formBinderProps
      ? {
          ...item.formBinderProps,
          name: item.formBinderProps.name,
          key: item.formBinderProps.name,
        }
      : {};
    return (
      <Form.Item {...props}>
        <Button {...item.componentProps}>{item.label}</Button>
      </Form.Item>
    );
  };

  renderInput = (item: configItem) => (
    <Form.Item
      name={item.formBinderProps.name}
      key={item.formBinderProps.name}
      {...item.formBinderProps}
    >
      <Input {...item.componentProps} />
    </Form.Item>
  );

  renderCheckbox = (item: configItem) => (
    <Form.Item
      name={item.formBinderProps.name}
      key={item.formBinderProps.name}
      {...item.formBinderProps}
    >
      <Checkbox {...item.componentProps}>{item.label}</Checkbox>
    </Form.Item>
  );

  renderFromItem = (): any =>
    config.map((item: any) => {
      if (item.component === 'Input') {
        return this.renderInput(item);
      }
      if (item.component === 'Checkbox') {
        return this.renderCheckbox(item);
      }
      if (item.component === 'Button') {
        return this.renderButton(item);
      }
      return null;
    });

  render() {
    return (
      <Row justify="center" style={{ paddingTop: '20%' }}>
        <Col flex="0 0 300px">
          <h4 className={styles.formTitle}>登录</h4>
          <Tabs onChange={this.onTabChange}>
            {tabs.map(item => (
              <Tabs.TabPane key={item.source} tab={item.tab}>
                <div>
                  <Form onFinish={this.onSubmit} onFinishFailed={this.onSubmitFailed}>
                    {this.renderFromItem()}
                  </Form>
                </div>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Col>
      </Row>
    );
  }
}

export default LoginFrom;
