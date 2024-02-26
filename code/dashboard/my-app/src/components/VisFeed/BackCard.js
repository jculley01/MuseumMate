import React from 'react';

const styles = {
  Card: {
    top: '270px',
    left: '1110px',
    width: '324px',
    height: '126px',
    backgroundColor: '#f0f0f0',
    borderRadius: '24px',
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