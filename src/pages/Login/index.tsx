import React, { Component } from "react";
import { Col, Row } from "antd";
import LoginIntro from "./LoginIntro";
import LoginForm from "./LoginForm";
import styles from "./index.less";

class Login extends Component {
  state = {};

  render() {
    return (
      <div className={styles.login}>
        <div className={styles.container}>
          <Row className={styles.row}>
            <Col span={12} className={styles.col}>
              <LoginIntro />
            </Col>
            <Col span={12} className={styles.col}>
              <LoginForm />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Login;
