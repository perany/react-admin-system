import React, { useEffect, useState } from 'react';
import { Input, InputNumber } from 'antd';
import classNames from 'classnames';

import styles from './index.less';

declare type numberType = number | string | undefined;

interface PNumberRangeProps {
  extend?: any;
  onChange?: (e: any) => void;
  value?: numberType[];
  unit?: any;
  split?: any;
  minProps?: any;
  maxProps?: any;
}

const PNumberRange = (props: PNumberRangeProps) => {
  const { unit = '', split = '~', minProps = {}, maxProps = {}, onChange, value = [] } = props;

  const [min, setMin] = useState<numberType>(Array.isArray(value) ? value[0] : undefined);
  const [max, setMax] = useState<numberType>(Array.isArray(value) ? value[1] : undefined);

  // value change effect
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange([min, max]);
    }
  }, [min, max]);

  // minimal number changed
  const onMinChange = (minValue: numberType) => {
    setMin(minValue);
  };

  // maximal number changed
  const onMaxChange = (maxValue: numberType) => {
    setMax(maxValue);
  };

  return (
    <div className={styles.numberRange}>
      <Input.Group compact>
        <InputNumber
          value={min}
          className={styles.inputLeft}
          placeholder="最小值"
          {...minProps}
          onChange={onMinChange}
        />
        <Input className={classNames(styles.inputSplit, 'label')} placeholder={split} disabled />
        <InputNumber
          value={max}
          className={styles.inputRight}
          placeholder="最大值"
          {...maxProps}
          onChange={onMaxChange}
        />
        <Input className={classNames(styles.inputUnit, 'label')} placeholder={unit} disabled />
      </Input.Group>
    </div>
  );
};

export default PNumberRange;
