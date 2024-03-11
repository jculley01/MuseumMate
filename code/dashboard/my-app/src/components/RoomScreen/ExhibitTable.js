import React from 'react';
import { Table, Tag, Badge } from 'antd';

// Define the columns based on the provided image.
const columns = [
  {
    title: 'Exhibit',
    dataIndex: 'exhibit',
    key: 'exhibit'
  },
  {
    title: 'Popularity',
    dataIndex: 'popularity',
    key: 'popularity',
    render: popularity => {
      let color = popularity === 'High' ? 'green' : 'volcano';
      return (
        <Tag color={color} key={popularity}>
          {popularity.toUpperCase()}
        </Tag>
      );
    }
  },
  {
    title: 'Scan Count',
    dataIndex: 'scanCount',
    key: 'scanCount'
  },
  {
    title: 'Trend',
    key: 'trend',
    dataIndex: 'trend',
    render: revenue => (
      <div style={{ color: 'green' }}>
        <Badge status="success" />
        {revenue}%
      </div>
    )
  }
];


const data = [
  {
    key: '1',
    exhibit: 'Exhibit - 2286',
    popularity: 'High',
    scanCount: 413,
    trend: '+28.4'
  },
  {
    key: '2',
    exhibit: 'Exhibit - 1973',
    popularity: 'Low',
    scanCount: 120,
    trend: '+28.4'
  },
  {
    key: '3',
    exhibit: 'Exhibit - 3600',
    popularity: 'High',
    scanCount: 400,
    trend: '+27.5'
  },
  {
    key: '4',
    exhibit: 'Exhibit - 3587',
    popularity: 'Low',
    scanCount: 350,
    trend: '+22.4'
  },
];

const ExhibitTable = () => <Table columns={columns} dataSource={data} pagination={false} />;

export default ExhibitTable;
