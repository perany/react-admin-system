import React, { useState } from 'react';
import { ConfigProvider, Button, DatePicker, Form, Input, Select, Radio, Cascader } from 'antd';
import { FormProps } from 'antd/es/form';
import classNames from 'classnames';

import { updateURLParams } from '@/utils/utils';
import PNumberRange from '@/components/PNumberRange';
import styles from './index.less';

interface PQueryFormProps extends FormProps {
  items: ItemProps[];
  updateValues?: (updateCall: any) => void;
  getFormInstance?: (from: any) => void;
  searchManual?: boolean;
}

interface ItemProps {
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  render?: (item?: any) => void;
  extend?: any;
  data?: any;
  /**
   * for select type
   * @param option: option data
   * @param item: select props
   * need to reset filterOption prop
   */
  renderChildren?: (option?: any, item?: any) => any;
  /**
   * item collapse
   * default: false
   */
  collapse?: boolean;
}

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = `${DATE_FORMAT} HH:mm:ss`;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PQueryForm = (props: PQueryFormProps) => {
  const { items, updateValues, getFormInstance, searchManual, className, ...rests } = props;
  const [form] = Form.useForm();

  const defaultCollapseItems = items?.filter((val: any) => val.collapse);
  const [collapse, setCollapse] = useState<boolean>(defaultCollapseItems?.length > 0);

  // update values
  if (updateValues) {
    updateValues((values: any) => {
      form.setFieldsValue(values);
    });
  }

  // update values
  if (getFormInstance) {
    getFormInstance(form);
  }

  // onChange wrap
  const onChangedCall = (item: any, value: any, callback: any) => {
    // check if disbaled searchAuto
    if (searchManual) {
      return;
    }
    // onchange
    const { extend } = item;
    if (typeof extend?.onChange === 'function') {
      const { onChange } = extend;
      onChange(value);
    }
    if (typeof callback === 'function') {
      callback();
    }
  };

  // input press enter
  const onInputPressEnter = () => {
    // item count except for buttons
    const itemsCount = items.filter((val: any) => val?.type !== 'toolbar');
    if (!searchManual && itemsCount?.length > 1) {
      form.submit();
    }
  };

  // type map to dom
  const itemTypeMap = {
    // 文本输入框
    input: (item: ItemProps) => (
      <Input
        placeholder={`请输入${item.label}`}
        style={{ width: 150 }}
        onPressEnter={() => onInputPressEnter()}
        {...item.extend}
        onChange={(value: any) =>
          onChangedCall(item, value, () => {
            updateURLParams({ [item.name]: value.target.value });
          })
        }
      />
    ),
    // 下拉搜索框
    select: (item: ItemProps) => {
      return (
        <Select
          showSearch
          allowClear
          placeholder={`请选择${item.label}`}
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            typeof option.children === 'string' &&
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          style={{ minWidth: 150 }}
          {...item.extend}
          onChange={(value: any) =>
            onChangedCall(item, value, () => {
              form.submit();
            })
          }
        >
          {Array.isArray(item.data) &&
            [...item.data].map((option: any) =>
              item?.renderChildren && typeof item?.renderChildren === 'function' ? (
                item.renderChildren(option, item)
              ) : (
                <Option value={option.value} key={option.value}>
                  {`${option.text}`}
                </Option>
              ),
            )}
        </Select>
      );
    },
    // 级联下拉搜索框
    cascader: (item: ItemProps) => {
      return (
        <Cascader
          allowClear
          showSearch={{
            filter: (inputValue: string, path: any) => {
              return path.some((option: any) => option.text?.indexOf(inputValue) > -1);
            },
          }}
          placeholder={`请选择${item.label}`}
          fieldNames={{ label: 'text' }}
          options={Array.isArray(item.data) ? item.data : []}
          style={{ minWidth: 150 }}
          {...item.extend}
          onChange={(value: any) =>
            onChangedCall(item, value, () => {
              form.submit();
            })
          }
        />
      );
    },
    // 日期范围选择框
    rangePicker: (item: ItemProps) => (
      <RangePicker
        format={TIME_FORMAT}
        {...item.extend}
        onChange={(value: any) => onChangedCall(item, value, () => form.submit())}
      />
    ),
    // 日期选择框
    datePicker: (item: ItemProps) => (
      <DatePicker
        format={DATE_FORMAT}
        {...item.extend}
        onChange={(value: any) => onChangedCall(item, value, () => form.submit())}
      />
    ),
    // 按钮组
    buttonGroup: (item: ItemProps) => (
      <Radio.Group
        buttonStyle="solid"
        {...item.extend}
        onChange={(value: any) => onChangedCall(item, value, () => form.submit())}
      >
        {Array.isArray(item.data) &&
          [...item.data].map((option: any) => (
            <Radio.Button value={option.value} key={option.value}>
              {`${option.text}`}
            </Radio.Button>
          ))}
      </Radio.Group>
    ),
    // 数字范围
    numberRange: (item: ItemProps) => {
      const { name, extend = {} } = item;
      return (
        <PNumberRange
          key={name}
          {...extend}
          onChange={(value: any) =>
            onChangedCall(item, value, () => {
              updateURLParams({ [item.name]: value.target.value });
            })
          }
        />
      );
    },
    // 自定义控件
    custom: (item: ItemProps) => {
      if (item?.render) {
        return item.render(item);
      }
      return null;
    },
    // 工具按钮
    toolbar: ({ name, label, extend, render }: any) => {
      if (render) {
        return render();
      }
      const btnProps = { type: 'default', ...extend, key: name };
      // toolbar btn type
      const toolBtnLength = items.filter(
        (val: any) => val.type === 'toolbar' && val.name !== 'submit',
      )?.length;
      // submit type
      if (name === 'submit') {
        btnProps.type = 'default';
        btnProps.onClick = (e: any) => {
          if (extend && typeof extend?.onClick === 'function') {
            extend.onClick(e);
          } else {
            form.submit();
          }
        };
      }
      // only one button show primary type
      if (toolBtnLength < 2) {
        btnProps.type = 'primary';
      }
      return <Button {...btnProps}>{label || '搜索'}</Button>;
    },
  };

  // collapse button change
  const onCollapseChanged = () => {
    setCollapse(!collapse);
  };

  // render Form.Item
  const ItemsDom = items.map(
    (item: ItemProps) =>
      (item.type !== 'toolbar' || item.name === 'submit') && (
        <Form.Item
          label={item.label}
          name={item.name}
          key={item.name}
          rules={[{ required: item.required, message: '请输入必填字段' }]}
          hidden={item.name !== 'submit' ? item?.collapse !== undefined && collapse : false}
        >
          {(itemTypeMap[item?.type ?? 'input'] ?? itemTypeMap.input)?.(item)}
        </Form.Item>
      ),
  );

  // render toolbar
  const toolbarDom = items.filter(
    (item: ItemProps) => item.type === 'toolbar' && item.name !== 'submit',
  );

  // render collapse button
  const collapseBtn = (
    <Form.Item className={styles.collapse}>
      <Button type="link" onClick={onCollapseChanged}>
        {collapse ? '高级' : '收起'}筛选
      </Button>
    </Form.Item>
  );

  return (
    <ConfigProvider input={{ autoComplete: 'off' }}>
      <Form
        form={form}
        layout="inline"
        {...rests}
        className={classNames(styles.PQueryForm, className)}
      >
        {ItemsDom}
        {defaultCollapseItems?.length > 0 && collapseBtn}
        {toolbarDom?.length > 0 && (
          <Form.Item className={styles.toolBtn}>
            {toolbarDom.map((item) => itemTypeMap.toolbar(item))}
          </Form.Item>
        )}
      </Form>
    </ConfigProvider>
  );
};

export default PQueryForm;
