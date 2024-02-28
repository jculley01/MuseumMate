import React from 'react';

const styles = {
  Card: {
    top: '16.5rem',
    left: '20.625rem',
    width: '39rem',
    height: '17rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '24px',
    alignItems: 'center',
    justifyContent: 'center', 
    marginLeft: '30px'
  },
};

const BackCard = (props) => {
  return (
    <div style={styles.Card}>
      {props.children}
    </div>
  );
};

export default BackCard;