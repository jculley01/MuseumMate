import React from 'react';

const styles = {
  Text: {
    display:'flex',
    color: '#030303',
    fontSize: '18px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    lineHeight: '24px',
    width:'50%'
  },
};

const defaultProps = {
  text: 'Active Users',
};

const ActiveLabel = (props) => {
  return (
    <div style={styles.Text}>
      {props.text ?? defaultProps.text}
    </div>
  );
};

export default ActiveLabel