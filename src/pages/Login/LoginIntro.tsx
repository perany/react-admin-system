import React from 'react';
import styles from './index.less';
import defaultSettings from '../../../config/defaultSettings';

const logo = require('../../assets/logo-kingnet.png');

export default () => (
  <div className={styles.leftContainer}>
    <div className={styles.logoCon}>
      <img src={logo} alt="log" height="32" />
      <span className={styles.title}> {defaultSettings.title}</span>
    </div>
  </div>
);
