import React from 'react';

const styles = {
  Card: {
    top: '0',
    left: '0',
    width: '43.75rem',
    height: '122px',
    backgroundColor: '#c7c7f1',
    borderRadius: '24px',
    position: 'absolute', // Positioning within the container
    marginLeft: '12px'
  },
};

const ActiveCard = (props) => {
  return (
    <div style={styles.Card}>
      {props.children}
    </div>
  );
};

export default ActiveCard;
