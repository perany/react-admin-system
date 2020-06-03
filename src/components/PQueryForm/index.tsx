import React from 'react';
import { ConfigProvider, Button, DatePicker, Form, Input, Select } from 'antd';
import styles from './index.less';
import { FormProps } from 'antd/es/form';
import { updateURLParams } from '@/utils/utils';

/**
 * example
 <CQueryForm
 onSubmit={values=>{}}
 onlyReset
 reset={()=>{}}
 queryConfig={[{
        type: "date-range-picker",
        label: "统计时间",
        defaultSelectDate: [moment().subtract(6, "days"), moment()],
        placeholder: ["开始时间", "结束时间"],
        maxSelectedLength: [7, "days"],
        format: "YYYY-MM-DD",
        required: true
      },{
        type: "submit",
        extend: false
      }]}
 loading={true|false}
 />
 * * */

interface PQueryFormProps extends FormProps {
  items: ItemProps[];
}

interface ItemProps {
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
  required?: string;
  render?: () => void;
  extend?: any;
  data?: any;
}

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
const { Option } = Select;

const PQueryForm = (props: PQueryFormProps) => {
  const { items, ...rests } = props;
  const [form] = Form.useForm();

  // type map to dom
  const itemTypeMap = {
    input: (item: ItemProps) => (
      <Input
        allowClear
        placeholder={`请输入${item.label}`}
        style={{ width: 150 }}
        onChange={(e) => updateURLParams({ [item.name]: e.target.value })}
        onPressEnter={() => form.submit()}
        {...item.extend}
      />
    ),
    select: (item: ItemProps) => (
      <Select
        showSearch
        allowClear
        placeholder={`请选择${item.label}`}
        optionFilterProp="children"
        filterOption={(input: any, option: any) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={() => form.submit()}
        style={{ minWidth: 150 }}
        {...item.extend}
      >
        {Array.isArray(item.data) &&
          [...item.data].map((option: any) => (
            <Option value={option.value} key={option.value}>
              {`${option.text}`}
            </Option>
          ))}
      </Select>
    ),
    rangePicker: (item: ItemProps) => (
      <RangePicker format={TIME_FORMAT} onChange={() => form.submit()} {...item.extend} />
    ),
    toolbar: ({ name, label, extend }: any) => {
      const btnProps = { ...extend, key: name };
      if (name === 'submit') {
        btnProps.type = 'primary';
      }
      return <Button {...btnProps}>{label || '查询'}</Button>;
    },
  };

  // render Form.Item
  const ItemsDom = items.map(
    (item: ItemProps) =>
      item.type !== 'toolbar' && (
        <Form.Item label={item.label} name={item.name} key={item.name}>
          {itemTypeMap[item?.type ?? 'input']?.(item)}
        </Form.Item>
      ),
  );

  // render toolbar
  const toolbarDom = items.filter((item: ItemProps) => item.type === 'toolbar');

  return (
    <ConfigProvider input={{ autoComplete: 'off' }}>
      <Form form={form} className={styles.PQueryTable} layout="inline" {...rests}>
        {ItemsDom}
        <Form.Item className={styles.toolBtn}>
          {toolbarDom.map((item) => itemTypeMap.toolbar(item))}
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

// class CQueryForm extends Component {
//   // submit
//   handleSubmit = (e) => {
//     e.preventDefault();
//     const {
//       onSubmit,
//       queryConfig,
//       form: { validateFields },
//       injectURLParams,
//     } = this.props;
//     validateFields((err, fieldsValue) => {
//       if (err) {
//         return;
//       }
//       let values = {};
//       if (fieldsValue.range_picker_date) {
//         const rangeValue = fieldsValue.range_picker_date;
//         let format = 'YYYY-MM-DD';
//         queryConfig.forEach((item) => {
//           if (item.type === 'date-range-picker' || item.type === 'range_picker_date') {
//             format = item.format ? item.format : format;
//           }
//         });
//         values = {
//           ...fieldsValue,
//           range_picker_date: [
//             rangeValue[0] ? rangeValue[0].format(format) : null,
//             rangeValue[1] ? rangeValue[1].format(format) : null,
//           ],
//         };
//       } else {
//         values = {
//           ...fieldsValue,
//         };
//       }
//       onSubmit(values);
//     });
//   };
//
//   // reset
//   handleReset = (e) => {
//     const { form, reset, onlyReset } = this.props;
//     form.resetFields();
//     if (reset) {
//       reset();
//     }
//     if (!onlyReset) {
//       this.handleSubmit(e);
//     }
//   };
//
//   // set value
//   setValues = (obj) => {
//     const {
//       form: { setFieldsValue },
//     } = this.props;
//     setFieldsValue(obj);
//   };
//
//   // render from items
//   itemRender = (item, i) => {
//     const {
//       form: { getFieldDecorator, getFieldValue },
//     } = this.props;
//     const itemConfig = {
//       range_picker_date: () => {
//         const itemObj = item;
//         const defaultSelectDate = item.defaultSelectDate || null;
//         const style = itemObj.style || {};
//         delete itemObj.style;
//         if (defaultSelectDate && typeof defaultSelectDate[0] === 'string') {
//           defaultSelectDate[0] = moment(defaultSelectDate[0]);
//           defaultSelectDate[1] = moment(defaultSelectDate[1]);
//         }
//         if (item.showTime) {
//           style.width = '370px';
//         }
//         return (
//           <Form.Item label={item.label}>
//             {getFieldDecorator('range_picker_date', {
//               initialValue: defaultSelectDate || null,
//               rules: [
//                 {
//                   type: 'array',
//                   required: item.required || false,
//                   message: '请选择时间',
//                 },
//               ],
//             })(
//               <RangePicker
//                 disabledDate={item.disabledDate}
//                 onChange={item.onChange}
//                 {...itemObj}
//                 style={style}
//               />,
//             )}
//           </Form.Item>
//         );
//       },
//       'date-range-picker': () => (
//         <Form.Item label={item.label}>
//           {getFieldDecorator('range_picker_date', {
//             initialValue: item.defaultSelectDate || null,
//             rules: [
//               {
//                 type: 'array',
//                 required: item.required || false,
//                 message: '请选择时间',
//                 validator: (rule, value, callback) => {
//                   if (item.required && (!value || (!value[0] && !value[1]))) {
//                     callback(rule.message);
//                   } else {
//                     callback();
//                   }
//                 },
//               },
//             ],
//           })(
//             <DateRangePicker
//               format={item.format}
//               maxSelectedLength={item.maxSelectedLength}
//               defaultSelectDate={item.defaultSelectDate}
//               placeholder={item.placeholder}
//               onChange={item.onChange}
//               style={{ height: '34px', lineHeight: '32px' }}
//             />,
//           )}
//         </Form.Item>
//       ),
//       input: () => {
//         // input addonBefore
//         const addonBeforeObj = item.addonBefore;
//         let label = item.label ? item.label : '';
//
//         const getOptionsName = (id, options) => {
//           let name;
//           if (options && options.length > 0) {
//             options.map((val) => {
//               if (val.id === id) {
//                 ({ name } = val);
//               }
//               return val;
//             });
//           }
//           return name;
//         };
//
//         if (addonBeforeObj && addonBeforeObj.type === 'select') {
//           addonBeforeObj.allowClear = false;
//           label = getOptionsName(getFieldValue(addonBeforeObj.key), addonBeforeObj.data);
//           addonBeforeObj.width = addonBeforeObj.width ? addonBeforeObj.width : '100px';
//         }
//
//         const inputProps = {
//           addonBefore: addonBeforeObj ? this.itemRender(addonBeforeObj) : null,
//           disabled: item.disabled,
//           placeholder: item.placeholder || '请输入',
//           style: { minWidth: item.width ? item.width : '200px' },
//         };
//
//         return (
//           <Form.Item
//             label={item.label}
//             key={i}
//             className={
//               item.required && item.addonBefore && item.addonBefore.type === 'select'
//                 ? 'required'
//                 : ''
//             }
//           >
//             {getFieldDecorator(item.key, {
//               initialValue: item.init ? item.init : undefined,
//               rules: [
//                 {
//                   required: item.required,
//                   message: `请输入${label}`,
//                 },
//               ],
//             })(<Input {...inputProps} />)}
//           </Form.Item>
//         );
//       },
//       select: () => (
//         <Form.Item label={item.label} key={i}>
//           {getFieldDecorator(item.key, {
//             initialValue: item.init ? item.init : undefined,
//             rules: [
//               {
//                 required: item.required,
//                 message: `请选择${item.label}`,
//               },
//             ],
//           })(
//             <Select
//               {...item}
//               onChange={item.onChange ? item.onChange : null}
//               placeholder={item.placeholder || '请选择'}
//               style={{ minWidth: item.width ? item.width : '200px' }}
//               allowClear={item.allowClear !== undefined ? item.allowClear : true}
//             >
//               {item.render
//                 ? item.render(item)
//                 : item.data &&
//                   item.data.map((val) => {
//                     return (
//                       <Option
//                         value={item.customIndex ? val[item.customIndex.id] : val.id}
//                         key={val.id}
//                       >
//                         {item.customIndex ? val[item.customIndex.name] : val.name}
//                       </Option>
//                     );
//                   })}
//             </Select>,
//           )}
//         </Form.Item>
//       ),
//       selectAndSearch: () => (
//         <Form.Item label={item.label} key={i}>
//           {getFieldDecorator(item.key, {
//             initialValue: item.init ? item.init : undefined,
//             rules: [
//               {
//                 required: item.required,
//                 message: `请选择${item.label}`,
//               },
//             ],
//           })(
//             <Select
//               {...item}
//               onChange={item.onChange ? item.onChange : null}
//               allowClear
//               showSearch
//               optionFilterProp="children"
//               placeholder={item.placeholder || '请选择'}
//               style={{ minWidth: item.width ? item.width : '200px' }}
//               // filterOption={(input, option) =>
//               //   option.props.children
//               //     .toLowerCase()
//               //     .indexOf(input.toLowerCase()) >= 0
//               // }
//             >
//               {item.render
//                 ? item.render(item)
//                 : item.data &&
//                   item.data.map((val) => {
//                     return (
//                       <Option
//                         value={item.customIndex ? val[item.customIndex.id] : val.id}
//                         key={val.id}
//                       >
//                         {item.customIndex ? val[item.customIndex.name] : val.name}
//                       </Option>
//                     );
//                   })}
//             </Select>,
//           )}
//         </Form.Item>
//       ),
//       threshold: () => (
//         <Form.Item label={item.label} key={i}>
//           <InputGroup compact>
//             {getFieldDecorator(item.min_key, {
//               rules: [
//                 {
//                   required: true,
//                   message: '请正确输入!',
//                 },
//               ],
//             })(<Input style={{ width: 100, textAlign: 'center' }} />)}
//             <Input
//               style={{
//                 width: 30,
//                 borderLeft: 0,
//                 pointerEvents: 'none',
//                 backgroundColor: '#fff',
//               }}
//               placeholder="-"
//               disabled
//             />
//             {getFieldDecorator(item.max_key, {
//               rules: [
//                 {
//                   required: true,
//                   message: '请正确输入!',
//                 },
//               ],
//             })(<Input style={{ width: 200, textAlign: 'center', borderLeft: 0 }} />)}
//           </InputGroup>
//         </Form.Item>
//       ),
//       submit: () => (
//         <Form.Item key={i}>
//           {(() => {
//             const { loading } = this.props;
//             switch (item.extend) {
//               case true:
//                 return item.render;
//               default:
//                 return (
//                   <Fragment>
//                     <Button
//                       type="primary"
//                       htmlType="submit"
//                       className={styles['submit']}
//                       loading={loading}
//                     >
//                       {item.submitLabel ? item.submitLabel : '搜索'}
//                     </Button>
//                     <Button onClick={this.handleReset}>
//                       {item.resetLabel ? item.resetLabel : '重置'}
//                     </Button>
//                   </Fragment>
//                 );
//             }
//           })()}
//         </Form.Item>
//       ),
//     };
//     return itemConfig[item && item.type ? item.type : 'input']();
//   };
//
//   // render from
//   fromRender = () => {
//     const { queryConfig } = this.props;
//     let domWrap = null;
//     let formDoms = [];
//     let btnDom = null;
//     if (queryConfig) {
//       queryConfig.map((item, i) => {
//         if (item.type !== 'submit') {
//           formDoms.push(this.itemRender(item, i));
//         } else {
//           btnDom = this.itemRender(item, i);
//         }
//       });
//       domWrap = (
//         <>
//           <div className={styles.left}>
//             {formDoms.map((item) => {
//               return item;
//             })}
//           </div>
//           <div className={styles.right}>{btnDom}</div>
//         </>
//       );
//     }
//     return domWrap;
//   };
//
//   render() {
//     return (
//       <div className={styles['item-table-query']}>
//         <Form layout="inline" onSubmit={this.handleSubmit}>
//           {this.fromRender()}
//         </Form>
//       </div>
//     );
//   }
// }

// export default Form.create({name: "query-form"})(CQueryForm);
export default PQueryForm;
