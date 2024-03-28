import React from 'react';

const AdminBar = () => {
  // Inline styles
  const adminDivStyle = {
    backgroundColor: '#f2f2f2',
    padding: '20px', // Increased padding for a larger box
    fontSize: '20px',
    fontWeight: '600',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: '24px', // Rounded edges
    width: '97%', // Set a specific width or use 'auto' for natural width
    boxSizing: 'border-box', // Make sure padding doesn't affect the total width
    marginLeft:'1.25rem',
    marginTop:'1.25rem',
    overflow:'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'
  };

  const adminSpanStyle = {
    color: '#000000',
    fontSize: '0.8em',
    marginTop: '5px',
  };

  return (
    <div style={adminDivStyle} role="admin">
      MuseumMate
      <span style={adminSpanStyle}>Admin</span>
    </div>
  );
}

export default AdminBar;
