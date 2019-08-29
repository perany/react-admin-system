import React, {Component} from "react";
import {Icon, NavBar, Toast} from 'antd-mobile';
import styles from "./KingrcTest.less";

class KingrcTest extends Component {

  state = {
    sticky: true,
  };

  render() {
    const {sticky} = this.state;
    return (
      <div>
        <div className={`${styles.top} ${sticky ? styles.sticky : ''}`}>
          <div className={styles.topcon}></div>
          <NavBar
            mode="light"
            icon={<Icon type="left"/>}
            onLeftClick={() => Toast.info('onLeftClick')}
            rightContent={[
              <Icon key="0" type="search" style={{marginRight: '16px'}}/>,
              <Icon key="1" type="ellipsis"/>,
            ]}
          >NavBar</NavBar>
        </div>

        <div style={{height: '2000px'}}>
          content
        </div>
      </div>
    );
  }
}

export default KingrcTest;
