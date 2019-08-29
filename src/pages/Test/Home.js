import React, {Component} from 'react';
import {Badge, Button, Tabs, WhiteSpace} from 'antd-mobile';
import {Sticky, StickyContainer} from 'react-sticky';
import router from 'umi/router';

function renderTabBar(props) {
  return (<Sticky>
    {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
  </Sticky>);
}

class Home extends Component {

  onClick = () => {
    router.push({
      pathname: '/detail',
      query: {id: 1},
    });
  };


  render() {

    const tabs = [
      {title: <Badge text={'3'}>First Tab</Badge>},
      {title: <Badge text={'更新'}>Second Tab</Badge>},
      {title: <Badge dot>Third Tab</Badge>},
    ];

    return (
      <div>
        <div style={{height: '100px', backgroundColor: '#eee'}}>banner</div>
        <StickyContainer>
          <Tabs tabs={tabs}
                initialPage={1}
                renderTabBar={renderTabBar}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '2500px',
              backgroundColor: '#eee'
            }}>
              Content of first tab
            </div>
            <div style={{
              display: 'flex',
              flexFlow: 'column wrap',
              alignItems: 'center',
              justifyContent: 'center',
              height: '500px',
              backgroundColor: '#fff'
            }}>
              <div>Content of second tab</div>
              <Button onClick={this.onClick} style={{width: '100%'}}>Go to Detail Page</Button>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '2000px',
              backgroundColor: '#efefef'
            }}>
              Content of third tab
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace/>
      </div>
    )
  }
}

export default Home;

