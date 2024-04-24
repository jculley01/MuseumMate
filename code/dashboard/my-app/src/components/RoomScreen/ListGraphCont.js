import React from 'react';
import { Card, Col, Row, List, Typography } from 'antd';
import CapacityLine from './CapacityLine'; // make sure this imports your chart component

const data = [
  'Mona Lisa',
  'Starry Night',
  'Artifacts',
  'Scream',
  'Portrait of T.Little',
  'Last Supper'
];
const listStyle = {
  backgroundColor: '#f2f2f2', // Replace with your desired background color
};

const ListComponent = () => (
  <List
    size="small"
    header={<h3>Top Exhibits</h3>}
    bordered
    dataSource={data}
    renderItem={item => <List.Item style={listStyle}>{item}</List.Item>}
    style={listStyle} // Applying the style to the List component itself
  />
);

const ListGraphCont = () => (
  <Row gutter={24}>
    <Col span={24}>
      <CapacityLine />
    </Col>
    <Col span={8}>
      <Card style={{backgroundColor:'#f2f2f2', marginLeft:'3.75rem', width:'85%'}}>
        {/* <ListComponent /> */}
      </Card>
    </Col>
  </Row>
);

export default ListGraphCont;
