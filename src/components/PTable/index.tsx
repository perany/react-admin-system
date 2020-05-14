import React from 'react';
import { Table } from 'antd';

const PTable = (props: any) => {
  const { pagination = {} } = props;
  const { current, pageSize } = pagination;
  const paginationParams = pagination
    ? {
        showQuickJumper: true,
        hideOnSinglePage: true,
        showSizeChanger: true,
        showTotal: (total: any) =>
          `共${total}条记录，每页${pageSize}条，共${Math.ceil(total / Number(pageSize))}页`,
        ...pagination,
        current: Number(current),
        pageSize: Number(pageSize),
      }
    : false;
  return (
    <Table
      rowKey={(record, index) => `${index}`}
      scroll={{ x: true }}
      size="middle"
      {...props}
      pagination={paginationParams}
    />
  );
};

export default PTable;
