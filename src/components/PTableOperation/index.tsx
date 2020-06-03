import React from 'react';
import { Dropdown, Menu, Popconfirm, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

interface OperationItem {
  key: string;
  label?: ((record: any) => string) | string;
  disabled?: (record: any) => boolean;
  popConfirm?: any;
  onClick?: (record: any) => void;
}

const ItemStyle = { marginRight: 5, minWidth: 0, padding: 0, height: '20px' };

const PTableOperation = ({
  config = [],
  rowData,
  max = 2,
}: {
  config: OperationItem[];
  rowData: any;
  max?: number;
}) => {
  const showBtnArr = [...config].splice(0, max);
  const hideBtnArr = config.length > max ? [...config].splice(max) : [];

  // single item render
  const renderItem = (item: any, isMore: boolean) => {
    let dom: any;

    // wheather item is disabled
    const isDisabled =
      typeof item.disabled !== 'function' ? !!item.disabled : item.disabled(rowData);

    // label
    const labelText = typeof item.label === 'function' ? item.label(rowData) : item.label;

    if (item.render) {
      // has `rendder`
      dom = item.render(rowData);
    } else if (item.popConfirm) {
      // has `popConfirm`
      const popProps: any = {
        ...item.popConfirm,
        placement: 'left',
        onClick: (e: any) => e.stopPropagation(),
        onConfirm: (e: any) => item.onClick(rowData, e),
        overlayStyle: { width: '220px' },
        key: `${item.key}-pop`,
      };
      // title is function
      if (typeof item.popConfirm.title === 'function') {
        popProps.title = item.popConfirm.title(rowData);
      }
      // bind container when in dropdown
      if (isMore) {
        popProps.getPopupContainer = (trigger: any) => trigger.parentNode;
      }
      // item button
      const buttonDom = (
        <Button type="link" disabled={isDisabled} style={ItemStyle} key={`${item.key}-button`}>
          {labelText}
        </Button>
      );
      // pnly render button when disabled
      dom = isDisabled ? buttonDom : <Popconfirm {...popProps}>{buttonDom}</Popconfirm>;
    } else {
      // common way
      dom = (
        <Button
          key={item.key}
          onClick={(e) => item.onClick(rowData, e)}
          type="link"
          disabled={isDisabled}
          style={ItemStyle}
        >
          {labelText}
        </Button>
      );
    }
    // render menu when item count over max
    if (isMore) {
      return <Menu.Item key={item.key}>{dom}</Menu.Item>;
    }
    return dom;
  };

  const menu = <Menu style={{}}>{hideBtnArr.map((item: any) => renderItem(item, true))}</Menu>;

  // render dropdown when item count over max
  const moreDom = hideBtnArr.length > 0 && (
    <Dropdown overlay={menu} trigger={['click']}>
      <a style={{ lineHeight: '24px', marginRight: 0 }} onClick={(e) => e.preventDefault()}>
        <MoreOutlined />
      </a>
    </Dropdown>
  );

  return (
    <>
      {showBtnArr.map((item: any) => renderItem(item, false))}
      {moreDom}
    </>
  );
};

export default PTableOperation;
