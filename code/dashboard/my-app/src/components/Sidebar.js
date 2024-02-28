import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('Overview', '1', <DesktopOutlined />),
  getItem('Feedback', '2', <MailOutlined />),
  getItem('Room Status', 'sub1', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Option 7', '7'),
    getItem('Option 8', '8'),
  ]),
];
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Determine the width based on the collapsed state
  const sidebarStyle = {
    width: collapsed ? '80px' : '256px', // Adjust the width as per your design
    height: '100vh', // Full viewport height
    transition: 'width 0.2s', // Smooth transition for the collapsing action
  };

  return (
    <div style={sidebarStyle}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 0,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};


export default Sidebar;