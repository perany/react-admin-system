import React from 'react';
import { Col, Row } from 'antd';
import LoginIntro from './LoginIntro';
import LoginForm from './LoginForm';
import styles from './index.less';

const Login = () => {
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <Row className={styles.row}>
          <Col xl={12} lg={12} md={10} xs={8} className={styles.col}>
            <LoginIntro />
          </Col>
          <Col xl={12} lg={12} md={14} xs={16} className={styles.col}>
            <LoginForm />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
