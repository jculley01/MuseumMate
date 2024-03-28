import React from 'react';

const styles = {
  Card: {
    top: '16.5rem',
    left: '20.625rem',
    width: '100%',
    height: '17.5rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '24px',
    alignItems: 'center',
    justifyContent: 'center', 
    marginLeft: '0px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
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