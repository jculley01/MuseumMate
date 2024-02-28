import React from 'react';

const styles = {
  Card: {
    top: '16.875rem',
    left: '69.375rem',
    width: '324px',
    height: '90px',
    backgroundColor: '#f0f0f0',
    borderRadius: '24px',
    justifyContent: 'center',
    alignItems: 'center',
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