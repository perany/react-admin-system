import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, DatePicker, Select, Button, Row, Table, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from '@umijs/hooks';
import { allMsgReaded, messageCount, msgStatusUpdate, msgConfig, messageMsgs } from './service';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

// interface SystemNoticeProps {}

const SystemNotice = () => {
  const [startTime, setStartTime] = useState<any>(
    moment(moment(moment().endOf('day')).subtract(30, 'days')).startOf('day'),
  );
  const [endTime, setEndTime] = useState<any>(moment().endOf('day'));
  const [msgOrigin, setMsgOrigin] = useState<string>('all');
  const [readStatus, setReadStatus] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // queryList api
  const { data: msgConfigData } = useRequest(msgConfig, {
    manual: false,
  });

  // queryList api
  const { run: getMsgCount, data: msgCountData } = useRequest(messageCount, {
    manual: false,
  });

  // queryList api
  const { run: runQuery, loading: queryLoading, data: tableData } = useRequest(
    (params: any) => messageMsgs(params),
    {
      manual: true,
      formatResult: (res) => ({
        list: res?.data?.body?.data ?? [],
        page: res?.data?.body?.page ?? {},
      }),
    },
  );

  // 消息列表
  const getTabData = () => {
    const params = {
      readStatus: readStatus === 2 ? null : readStatus,
      msgOrigin: msgOrigin === 'all' ? null : msgOrigin,
      startTime: startTime.valueOf(),
      endTime: endTime.valueOf(),
      pageNum: currentPage,
      pageSize,
    };
    runQuery(params).then();
  };

  useEffect(() => {
    getTabData();
  }, [startTime, endTime, msgOrigin, readStatus, currentPage, pageSize]);

  // 打开消息面板
  const onDropdownClick = () => {
    // 查询消息内容
    getTabData();
  };

  // 时间筛选
  const onTimeChange = (dates: any) => {
    setStartTime(dates[0]);
    setEndTime(dates[1]);
    setCurrentPage(1);
  };

  // 发送类型
  const onTypeChange = (value: string) => {
    setMsgOrigin(value);
    setCurrentPage(1);
  };

  // 阅读状态修改
  const onReadStatusChange = (value: number) => {
    setReadStatus(value);
    setCurrentPage(1);
  };

  // 全部已读
  const allMsgRead = () => {
    const params = {
      readStatus: readStatus === 2 ? null : readStatus,
      msgOrigin: msgOrigin === 'all' ? '' : msgOrigin,
      startTime: startTime.valueOf(),
      endTime: endTime.valueOf(),
      pageNum: currentPage,
      pageSize,
    };
    allMsgReaded(params).then((response: any) => {
      if (response.code === 0) {
        message.success('已清空全部未读!');
        if (readStatus) {
          setReadStatus(0);
        } else {
          getTabData();
        }
        getMsgCount().then();
      }
    });
  };

  // 单个已读
  const onItemBtn = (record: any) => {
    if (!record.readStatus) {
      msgStatusUpdate({
        originId: record.originId,
        status: 1,
      }).then((response: any) => {
        if (response.code === 0) {
          message.success('消息已读!');
          getTabData();
          getMsgCount().then();
        }
      });
    }
  };

  // onTableChange
  const onTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log('onTableChange', pagination, filters, sorter, extra);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: '来源',
      dataIndex: 'msgOrign',
      key: 'msgOrign',
      width: '8%',
      render: (text: number, record: any) => (record.readStatus ? text : <Badge dot>{text}</Badge>),
    },
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
      width: '20%',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '22%',
      render: (text: number) => moment(text).format('YYYY-MM-DD HH:mm'),
    },
  ];

  const content = (
    <div className={styles.dropContent}>
      <Row>
        <RangePicker
          allowClear={false}
          defaultValue={[
            moment(startTime, 'YYYY-MM-DD HH:mm'),
            moment(endTime, 'YYYY-MM-DD HH:mm'),
          ]}
          format="YYYY-MM-DD HH:mm"
          showTime={{ format: 'HH:mm' }}
          onOk={onTimeChange}
          style={{ width: 340, marginRight: 8 }}
        />
        <Select
          style={{ width: 80, marginRight: 8 }}
          defaultValue={msgOrigin}
          onChange={onTypeChange}
        >
          <Option value="all">全部</Option>
          {Array.isArray(msgConfigData?.data) &&
            msgConfigData?.data.map((item: any) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
        <Select
          style={{ width: 80, marginRight: 8 }}
          value={readStatus}
          onChange={onReadStatusChange}
        >
          <Option value={2}>全部</Option>
          <Option value={1}>已读</Option>
          <Option value={0}>未读</Option>
        </Select>
        <Button type="primary" style={{ marginRight: 8 }} onClick={getTabData}>
          查询
        </Button>
        <Button onClick={allMsgRead}>清空未读</Button>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Table
          rowKey={(record, index) => `${index}`}
          dataSource={tableData?.list ?? []}
          columns={columns}
          pagination={{
            size: 'small',
            showQuickJumper: true,
            hideOnSinglePage: true,
            showSizeChanger: true,
            showTotal: (total: any) =>
              `您有${total}条消息，共${Math.ceil(total / Number(pageSize))}页`,
            total: tableData?.page?.totalRows ?? 0,
            current: currentPage,
            pageSize,
          }}
          loading={queryLoading}
          size="small"
          rowClassName={(record) => (!record.readStatus ? styles.toReadRow : styles.readRow)}
          onRow={(record) => {
            return {
              onClick: () => onItemBtn(record), // 点击行
            };
          }}
          onChange={onTableChange}
          scroll={{ y: 450 }}
        />
      </Row>
    </div>
  );

  return (
    <Dropdown
      placement="bottomRight"
      trigger={['click']}
      overlay={content}
      className={styles.popover}
      overlayClassName={styles.container}
      onVisibleChange={(visible: boolean) => {
        setModalVisible(visible);
      }}
      visible={modalVisible}
    >
      <span className={styles.action} onClick={onDropdownClick}>
        <Badge count={msgCountData?.data} style={{ boxShadow: 'none' }} className={styles.badge}>
          <BellOutlined className={styles.icon} />
        </Badge>
      </span>
    </Dropdown>
  );
};

export default SystemNotice;
