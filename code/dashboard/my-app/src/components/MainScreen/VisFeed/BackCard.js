import React from 'react';

const styles = {
  Card: {
    top: '16.875rem',
    left: '69.375rem',
    width: '100%',
    height: '7.3125rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '24px',
    justifyContent: 'center',
    alignItems: 'center',
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