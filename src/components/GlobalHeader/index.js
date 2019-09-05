import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import TopBaseMenu from './TopBaseMenu';
import { getFlatMenuKeys } from '@/components/SiderMenu/SiderMenuUtils';

export default class GlobalHeader extends PureComponent {
    state = {
        maxWidth: undefined,
    };

    static getDerivedStateFromProps(props) {
        return {
            maxWidth:
                (props.contentWidth === 'Fixed' && window.innerWidth > 1200 ? 1200 : window.innerWidth) -
                280 -
                120 -
                40,
        };
    }

    componentWillUnmount() {
        this.triggerResizeEvent.cancel();
    }

    /* eslint-disable*/
    @Debounce(600)
    triggerResizeEvent() {
        // eslint-disable-line
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }

    toggle = () => {
        const { collapsed, onCollapse } = this.props;
        onCollapse(!collapsed);
        this.triggerResizeEvent();
    };

    render() {
        const { collapsed, isMobile, logo, menuData, topNavTheme } = this.props;
        const { maxWidth } = this.state;
        const flatMenuKeys = getFlatMenuKeys(menuData);
        return (
            <div className={`${styles.header} ${topNavTheme !== 'dark' ? styles.light : ''}`}>
                <div className={styles.left}>
                    {isMobile && (
                        <Link to="/" className={styles.logo} key="logo">
                            <img src={logo} alt="logo" width="32"/>
                        </Link>
                    )}
                    <span className={`${styles.trigger} ${topNavTheme !== 'dark' ? styles.light : ''}`} onClick={this.toggle}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
          </span>
          {topNavTheme && (
            <div
              style={{
                maxWidth,
              }}
            >
              <TopBaseMenu
                {...this.props}
                maxWidth={maxWidth}
                flatMenuKeys={flatMenuKeys}
                className={styles.menu}
                theme={topNavTheme}
              />
            </div>
          )}
        </div>
        <RightContent {...this.props} />
      </div>
    );
  }
}
