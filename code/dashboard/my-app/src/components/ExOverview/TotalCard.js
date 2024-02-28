import React from 'react';

const styles = {
  Card: {
    position: 'absolute',
    right: '0', // Align to the right edge of the container
    top: '0', // Optional: Adjust based on layout needs
    width: '20.9375rem', // Your specified width
    height: '7rem', // Your specified height
    backgroundColor: '#f0f0f0', // Your specified background
    borderRadius: '24px',
    marginTop: '5px',
    marginRight: '67px'
  },
};

const TotalCard = (props) => {
  return (
    <div style={styles.Card}>
      {props.children}
    </div>
  );
};

export default TotalCard;