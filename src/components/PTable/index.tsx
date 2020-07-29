import React from 'react';
import { Table } from 'antd';

const PTable = (props: any) => {
  const { pagination = {} } = props;
  const { current, pageSize } = pagination;
  const paginationParams = pagination
    ? {
        size: 'default',
        showQuickJumper: true,
        // hideOnSinglePage: true,
        showSizeChanger: true,
        showTotal: (total: any) => `总计${total}条`,
        // `共${total}条记录，每页${pageSize}条，共${Math.ceil(total / Number(pageSize))}页`,
        ...pagination,
        current: Number(current),
        pageSize: Number(pageSize),
      }
    : false;
  return (
    <Table
      bordered
      rowKey={(record) =>
        record && Object.keys(record)?.length > 0
          ? record?.id ?? JSON.stringify(record)
          : Math.random()
      }
      scroll={{ x: true }}
      size="middle"
      {...props}
      pagination={paginationParams}
    />
  );
};

export default PTable;
