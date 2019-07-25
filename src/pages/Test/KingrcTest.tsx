import React, { Component } from "react";
// import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { DateRangePicker, GridList } from "kingrc";
import styles from "./KingrcTest.less";
import { PageHeaderWrapper } from "@ant-design/pro-layout";

class KingrcTest extends Component {
  render() {
    return (
      <PageHeaderWrapper title="kingRC组件测试页">
        <div className={styles.test}>
          <p>时间范围选择器</p>
          <DateRangePicker className={"date-picker"} />
          <p>信息展示列表</p>
          <GridList
            columns={[
              { title: "账号1", dataIndex: "username1" },
              { title: "账号2", dataIndex: "username2", allRow: true },
              { title: "账号3", dataIndex: "username3" },
              { title: "账号4", dataIndex: "username4" }
            ]}
            dataSource={{
              username1: "账号内容1",
              username2: "账号内容2-占据整行",
              username3: "账号内容3",
              username4: "账号内容4"
            }}
            bordered
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default KingrcTest;
