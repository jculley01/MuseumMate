import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Dropdown, Menu } from 'antd';
import IconButton from './IconButton'; 
import { DownOutlined } from '@ant-design/icons';
import ListGraphCont from './ListGraphCont';
import ExhibitTable from './ExhibitTable';
import RoomLabel from './Roomlabel';
import { useParams } from 'react-router-dom';


const overviewStyle = {
  backgroundColor: '#f0f0f0', // Replace with the actual background color from your image
  padding: '20px',
  borderRadius: '8px',
  marginBottom:'20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  borderRadius: '24px', // Rounded edges
  marginLeft:'1.25rem',
  width: '95.5%',
  marginTop:'20px',
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

const RoomOverview = () => {
  const { roomNumber } = useParams();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("today");
  const [menuLabel, setMenuLabel] = useState("Today's Data");
  const [stats, setStats] = useState({
    currentUsers: 0,
    totalUsers: 0,
    averageDuration: 0,
    totalVisits: 0,
  });

  const resetStats = () => {
    setStats({
      currentUsers: 0,
      totalUsers: 0,
      averageDuration: 0,
      totalVisits: 0
    });
  };

  const fetchData = async () => {
    //resetStats(); // Reset stats before fetching new data
    try {
      const [dataResponse, occupancyResponse, totalResponse] = await Promise.all([
        fetch(`http://128.197.53.112:3000/api/room-stats/${selectedTimePeriod}`),
        fetch('http://128.197.53.112:3000/api/room-occupancies'),
        fetch('http://128.197.53.112:3000/api/total-users')
      ]);
      const [data, occupancyData, totalData] = await Promise.all([
        dataResponse.json(),
        occupancyResponse.json(),
        totalResponse.json()
      ]);

      const roomStats = data.find(stat => stat.roomName === `${roomNumber}`);
      const occupancyStats = occupancyData.occupancies.find(o => o.roomID === roomNumber);

      // Update stats, handle possible nulls
      setStats({
        currentUsers: occupancyStats && occupancyStats.occupancy ? occupancyStats.occupancy : 0,
        totalUsers: totalData && totalData.totalUsers ? totalData.totalUsers : 0,
        averageDuration: roomStats && roomStats.averageDuration ? roomStats.averageDuration : 0,
        totalVisits: roomStats && roomStats.totalVisits ? roomStats.totalVisits : 0,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [selectedTimePeriod, roomNumber]);

  const handleMenuClick = (e) => {
    setSelectedTimePeriod(e.key);
    setMenuLabel(e.item.props.children); // This will trigger useEffect to refetch data
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="today">Today's Data</Menu.Item>
      <Menu.Item key="yesterday">Yesterday's Data</Menu.Item>
      <Menu.Item key="last_month">Last Month's Data</Menu.Item>
      <Menu.Item key="last_year">Last Year's Data</Menu.Item>
    </Menu>
  );

  return (
  <div>
    <div>
    <RoomLabel text={`Room ${roomNumber}`}/>
  </div>
  <div>
    <div style={overviewStyle} className='overview'>
          <Row style={{ marginBottom: '10px' }}>
            <Col span={23} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Peak Times</h3>
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  {menuLabel} <DownOutlined />
                </a>
              </Dropdown>
            </Col>
          </Row>
    <Row gutter={16}>
      <Col span={6}>
        <Card style={cardStyle} bordered={false}>
          <IconButton />
          <h3>Current Visitor Count</h3>
          <h1> {stats.currentUsers} </h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} bordered={false}>
          <IconButton />
          <h3>Total Museum Visitors</h3>
          <h1> {stats.totalUsers} </h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} bordered={false}>
          <IconButton />
          <h3>Average Visit Duration</h3>
                <h1> {(stats.averageDuration / 60).toFixed(1)} minutes </h1>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} bordered={false}>
          <IconButton />
          <h3>Total Visits</h3>
          <h1> {stats.totalVisits} </h1>
        </Card>
      </Col>
    </Row>
    </div>
      <div className='graph'
    style={{
    backgroundColor:'#f0f0f0', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    borderRadius: '24px', // Rounded edges
    marginLeft:'1.25rem',
    width:'97.5%'
    }}>
      <ListGraphCont/>
      </div>
      <div className='row3'   
    style={{
    backgroundColor:'#f0f0f0', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    borderRadius: '24px', // Rounded edges
    marginLeft:'1.25rem',
    marginTop:'20px',
    width:'97.5%'
    }}>
        <ExhibitTable/>
      </div>
  </div>
  </div>
  

  
  
);
}

export default RoomOverview;
