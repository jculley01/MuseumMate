import React from 'react';

const styles = {
  Card: {
    position: 'absolute',
    right: '0', 
    top: '0', 
    width: '60%',
    height: '7rem', 
    backgroundColor: '#f0f0f0', // Your specified background
    borderRadius: '24px',
    marginTop: '5px',
    marginRight: '1.59rem'
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