import React from 'react';
import {DefaultFooter,} from "@ant-design/pro-layout";

export const footer = {
    links: [{
        key: 'privacy',
        title: "隐私条款",
        href: '',
        blankTarget: true,
    }],
    copyright: "2019 恺英网络平台技术中心出品",
};

class Footer extends React.Component {
    render() {
        return (<DefaultFooter  {...footer}/>);
    }
}

export default Footer;
