import React from 'react';

const styles = {
  Card: {
    display: 'flex',
    justifyContent: 'space-around',
    top: '22.5rem',
    left: '22.5rem',
    width: '43.125rem',
    height: '7.625rem',
    backgroundColor: '#c7c7f1',
    borderRadius: '1.5rem',
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
