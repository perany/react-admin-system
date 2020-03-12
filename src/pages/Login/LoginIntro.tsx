import React from "react";
import styles from "./index.less";

const logo = require("../../assets/logo-kingnet.png");

export default () => (
  <div className={styles.leftContainer}>
    <div className={styles.logoCon}>
      <div className="ant-layout-sider-children">
        <a href="/">
          <img
            src={logo}
            alt="log"
            height="32"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
          {/* <h1> {Title}</h1> */}
        </a>
      </div>
    </div>
  </div>
);
