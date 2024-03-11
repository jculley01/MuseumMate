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

const ListComponent = () => (
  <List
    size="small"
    header={<h3>Top Exhibits</h3>}
    bordered
    dataSource={data}
    renderItem={item => <List.Item>{item}</List.Item>}
  />
);

const ListGraphCont = () => (
  <Row gutter={24}>
    <Col span={16}>
      <CapacityLine />
    </Col>
    <Col span={8}>
      <Card>
        <ListComponent />
      </Card>
    </Col>
  </Row>
);

export default ListGraphCont;
