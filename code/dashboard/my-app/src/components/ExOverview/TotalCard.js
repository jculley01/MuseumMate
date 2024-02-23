import React from 'react';

const styles = {
  Card: {
    top: '22.8125rem',
    left: '44.375rem',
    width: '20.9375rem',
    height: '7rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '24px',
    marginTop: '0.7%',
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