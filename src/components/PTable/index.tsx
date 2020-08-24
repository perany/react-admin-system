import React from 'react';
import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';

export interface PTableProps extends TableProps<any> {
  pagination?: any;
  scroll?: any;
}

const PTable = (props: PTableProps) => {
  const { pagination = {}, scroll, ...restProps } = props;

  // pagination
  const { current, pageSize } = pagination as TablePaginationConfig;
  const paginationParams = pagination
    ? {
        size: 'default',
        showQuickJumper: true,
        // hideOnSinglePage: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '15', '20', '50', '100'],
        showTotal: (total: any) => `总计${total}条`,
        // `共${total}条记录，每页${pageSize}条，共${Math.ceil(total / Number(pageSize))}页`,
        ...pagination,
        current: Number(current),
        pageSize: Number(pageSize),
      }
    : false;

  // config overwrite
  const overwriteConfig: any = {};

  // scroll
  if (scroll !== false) {
    overwriteConfig.scroll = scroll || { x: true };
  }

  return (
    <Table
      bordered
      rowKey={(record) =>
        record && Object.keys(record)?.length > 0
          ? record?.id ?? JSON.stringify(record)
          : Math.random()
      }
      size="middle"
      {...restProps}
      {...overwriteConfig}
      pagination={paginationParams as TablePaginationConfig}
    />
  );
};

export default PTable;
