import React from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { PageHeader, Tabs } from 'antd-mobile';
import { connect } from 'dva';
import classNames from 'classnames';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';
import { conversionBreadcrumbList } from './breadcrumb';


/**
 * render Footer tabList
 * In order to be compatible with the old version of the PageHeader
 * basically all the functions are implemented.
 */
const renderFooter = ({ tabList, tabActiveKey, onTabChange, tabBarExtraContent }) => {
  return tabList && tabList.length ? (
    <Tabs
      className={styles.tabs}
      activeKey={tabActiveKey}
      onChange={key => {
        if (onTabChange) {
          onTabChange(key);
        }
      }}
      tabBarExtraContent={tabBarExtraContent}
    >
      {tabList.map(item => (
        <Tabs.TabPane tab={item.tab} key={item.key} />
      ))}
    </Tabs>
  ) : null;
};

const PageHeaderWrapper = ({
  children,
  contentWidth,
  fluid,
  wrapperClassName,
  home,
  top,
  title,
  content,
  logo,
  extraContent,
  hiddenBreadcrumb,
  ...restProps
}) => {
  return (
    <div style={{ margin: '-24px -24px 0' }} className={classNames(wrapperClassName, styles.main)}>
      {top}
      <MenuContext.Consumer>
        {value => {
          return (
            <div className={styles.wrapper}>
              <div
                className={classNames({
                  [styles.wide]: !fluid && contentWidth === 'Fixed',
                })}
              >
                <PageHeader
                  title={
                    <>
                      {logo && <span className={styles.logo}>{logo}</span>}
                      <h3
                        level={4}
                        style={{
                          marginBottom: 0,
                          display: 'inline-block',
                        }}
                      >
                        {title}
                      </h3>
                    </>
                  }
                  key="pageheader"
                  {...restProps}
                  breadcrumb={
                    !hiddenBreadcrumb &&
                    conversionBreadcrumbList({
                      ...value,
                      ...restProps,
                      ...(home !== null && {
                        home: <FormattedMessage id="menu.home" defaultMessage="Home" />,
                      }),
                    })
                  }
                  className={styles.pageHeader}
                  linkElement={Link}
                  footer={renderFooter(restProps)}
                >
                  <div className={styles.detail}>
                    <div className={styles.main}>
                      <div className={styles.row}>
                        {content && <div className={styles.content}>{content}</div>}
                        {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
                      </div>
                    </div>
                  </div>
                </PageHeader>
              </div>
            </div>
          );
        }}
      </MenuContext.Consumer>
      {children ? (
        <div className={styles['children-content']}>
          <GridContent>{children}</GridContent>
        </div>
      ) : null}
    </div>
  );
};

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
