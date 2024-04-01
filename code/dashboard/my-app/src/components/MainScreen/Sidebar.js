import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  AppstoreOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';

// Modified getItem function to accept an onClick callback
function getItem(label, key, icon, children, type, onClick) {
  return {
    key,
    icon,
    children,
    label,
    type,
    onClick, // Add onClick here
  };
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handler for toggle collapsed state
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Add the navigate function to the "Room 1.1" item
  const items = [
    getItem('Overview', '1', <DesktopOutlined />),
    getItem('Feedback', '2', <MailOutlined />),
    getItem('Room Status', 'sub1', <AppstoreOutlined />, [
      getItem('Room 1.1', '1.1'),
      // ... other items
    ]),
  ];

  // Determine the width based on the collapsed state
  const sidebarStyle = {
    width: collapsed ? '80px' : '256px', // Adjust the width as per your design
    height: '100vh', // Full viewport height
    transition: 'width 0.2s', // Smooth transition for the collapsing action
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'
  };

  const onMenuItemClick = (e) => {
    const { key } = e;
    switch (key) {
      case '1': // Overview
        navigate('/');
        break;
      case '2': // Feedback
        navigate('/feedback');
        break;
      case '1.1': // Room 1.1
        navigate('/room-overview');
        break;
      // Add more cases as you add more routes
      default:
        // Handle default case if necessary, or just break
        break;
    }
  };

    return (
      <div style={sidebarStyle}>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            height:'64px',
            width:'100%',
            marginBottom: 16,
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
          onClick={onMenuItemClick} // Use the new click handler here
        />
      </div>
    );
  };

export default Sidebar;
