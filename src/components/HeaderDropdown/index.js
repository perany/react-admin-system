import React, {PureComponent} from 'react';
import {ActionSheet, Button, WhiteSpace, WingBlank} from 'antd-mobile';
import classNames from 'classnames';
import styles from './index.less';

export default class HeaderDropdown extends PureComponent {

  showActionSheet = () => {
    const BUTTONS = ['Operation1', 'Operation2', 'Operation2', 'Delete', 'Cancel'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        // title: 'title',
        message: 'I am description, description, description',
        maskClosable: true,
        'data-seed': 'logId',
        wrapProps,
      },
      (buttonIndex) => {
        console.log(buttonIndex, BUTTONS[buttonIndex])
      });
  }

  render() {
    const {overlayClassName, overlay, ...props} = this.props;
    return (
      <WingBlank className={classNames(styles.container, overlayClassName)} {...props}>
        <Button onClick={this.showActionSheet}>showActionSheet</Button>
        <WhiteSpace/>
      </WingBlank>
    );
  }
}
