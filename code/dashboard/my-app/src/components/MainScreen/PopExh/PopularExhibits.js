import React from 'react';
import { Avatar, List, Button,Tag } from 'antd';

const data = [
  {
    title: 'Exhibit - 3600',
    popularity: 'High',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU', // Replace with actual image links
  },
  {
    title: 'Exhibit - 3600',
    popularity: 'High',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU',
  },
  {
    title: 'Exhibit - 3600',
    popularity: 'Low',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU',
  },
  {
    title: 'Exhibit - 3600',
    popularity: 'Low',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU',
  },
  {
    title: 'Exhibit - 3600',
    popularity: 'High',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU', // Replace with actual image links
  },
  {
    title: 'Exhibit - 3600',
    popularity: 'High',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU',
  },
  {
    title: 'Exhibit - 3600',
    popularity: 'Low',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU',
  },
  {
    title: 'Exhibit - 3600',
    popularity: 'Low',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU',
  },
  {
    title: 'Exhibit - 3600',
    popularity: 'High',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU', // Replace with actual image links
  },
];

const PopularExhibits = () => {
    return (
        <div>
          <h2>Popular exhibits</h2>
          <List
            itemLayout="horizontal"
            dataSource={data}
            pagination={{
              pageSize: 4, // Adjust the number of items per page if needed
            }}
            renderItem={item => (
              <List.Item
                actions={[<Button type="primary">Monitor</Button>]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.title}
                  description={
                    <Tag color={item.popularity === 'High' ? 'green' : 'volcano'}>
                      {item.popularity}
                    </Tag>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      );
    };

export default PopularExhibits;
