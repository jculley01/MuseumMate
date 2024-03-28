import React from 'react';

const RoomLabel = ({ text }) => {
  // Updated styles here
  const divStyle = {
    backgroundColor: '#f2f2f2',
    color: '#030303',
    fontSize: '52px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    lineHeight: '48px',
    marginTop: '40px',
    height: '110px',
    display: 'flex', // Make it a flex container
    alignItems: 'flex-end', // Align children to the bottom
    justifyContent: 'flex-start', // Align children to the left
    padding: '0 0 10px 10px', // Add padding at the bottom and left to offset the text a bit from the corner
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    borderRadius: '24px', // Rounded edges
    marginLeft:'1.25rem',
    width: '97%',
  };

  return (
    <div style={divStyle}>
      {text}
    </div>
  );
};

export default RoomLabel;
