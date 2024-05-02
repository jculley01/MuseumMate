import React from 'react';
import { Avatar, List, Button,Tag } from 'antd';

const data = [
  {
    title: 'Mona Lisa',
    popularity: 'High',
    avatar: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQ-FvbbAq5IaJUhtwxXEwY0D-jiZju02ejnNHx_bQWL_27GF3srhwJgqusMAqKh3QqU', // Replace with actual image links
  },
  {
    title: 'Starry Night',
    popularity: 'High',
    avatar: 'https://lh3.googleusercontent.com/Pd2nCUHUz4Ruc76LRh1-H0Dldl04hWSXw8P9uCYZ4TIWP7yNPArIgWlHZrf1qT9T=s1200',
  },
  {
    title: 'Scream',
    popularity: 'Low',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg'},
  {
    title: 'Last Supper',
    popularity: 'Low',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg',
  },
  {
    title: 'The Kiss',
    popularity: 'High',
    avatar: 'https://lh3.googleusercontent.com/7aJyS2Nd7c8oCJKmfXlmM-rnSnLMY0ykfBFOP8N3OjV6M4hbhS_NEg8tH6SJDfvl=s1200'},

  {
    title: 'American Gothic',
    popularity: 'High',
    avatar: 'https://lh3.googleusercontent.com/y-iFOHfLTwkuQSUegpwDdgKmOjRSTvPxat63dQLB25xkTs4lhIbRUFeNBWZzYf370g=s1200',
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
    <div style={{ backgroundColor: '#f0f2f5', borderRadius: '15px', padding: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' }}> 
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
