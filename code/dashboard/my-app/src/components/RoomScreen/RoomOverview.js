import React from 'react';
import { Card, Col, Row, Dropdown, Menu } from 'antd';
import IconButton from './IconButton'; 
import { DownOutlined } from '@ant-design/icons';
import ListGraphCont from './ListGraphCont';
import ExhibitTable from './ExhibitTable';

const overviewStyle = {
  backgroundColor: '#f0f0f0', // Replace with the actual background color from your image
  padding: '20px',
  borderRadius: '8px',
  marginBottom:'20px'
};

const cardStyle = {
  backgroundColor: '#f0f0f0', // Replace with your desired color code
};

const percentageStyle = (isPositive) => ({
  color: isPositive ? 'green' : 'red',
  fontSize: '0.9em',
  display: 'inline-block',
  marginLeft: '5px'
});

// Menu for the dropdown
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="#today">Today's data</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="#yesterday">Yesterday's data</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3" disabled>
      More options
    </Menu.Item>
  </Menu>
);

const RoomOverview = () => (
  <div>
    <div style={overviewStyle} className='overview'>
    <Row style={{ marginBottom: '10px' }}>
      <Col span={23} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Peak Times</h3>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()} href="#data">
            Today's data <DownOutlined />
          </a>
        </Dropdown>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={6}>
        <Card style={cardStyle} bordered={false}>
          <IconButton />
          <h3>Current Users</h3>
          <h1>245 <span style={percentageStyle(true)}>+28.4%</span></h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} bordered={false}>
          <IconButton />
          <h3>Total Users</h3>
          <h1>1567 <span style={percentageStyle(false)}>-28.4%</span></h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} bordered={false}>
          <IconButton />
          <h3>Media Scanned</h3>
          <h1>2677 <span style={percentageStyle(true)}>+28.4%</span></h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} bordered={false}>
          <IconButton />
          <h3>More info needed</h3>
          <h1>112</h1>
        </Card>
      </Col>
    </Row>
    </div>
      <div className='graph'>
      <ListGraphCont/>
      </div>
      <div className='row3'>
        <ExhibitTable/>
      </div>
  </div>

  
  
);

export default RoomOverview;
