import React, {Component} from "react";
import {Button} from "antd";
import router from 'umi/router';
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

class Detail extends Component {
  render() {
    const {match} = this.props;
    return (
      <PageHeaderWrapper title={`详情页 ${match.params.id}`}>
        <div>
          <Button onClick={() => {
            router.goBack();
          }}>
            返回
          </Button>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Detail;
