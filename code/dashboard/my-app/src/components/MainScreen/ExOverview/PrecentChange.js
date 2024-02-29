import React from 'react';

const styles = {
  Button: {
  
    cursor: 'pointer',
    top: '385px',
    left: '605px',
    width: '76px',
    height: '24px',
    padding: '0px 8px',
    border: '0',
    boxSizing: 'border-box',
    borderRadius: '24px',
    backgroundColor: '#5856d6',
    color: '#ffffff',
    fontSize: '15px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    lineHeight: '20px',
    outline: 'none',
  },
};

const defaultProps = {
  label: '+ 28.4%',
};

const PrecentChange = (props) => {
  return (
    <button style={styles.Button}>
      {props.label ?? defaultProps.label}
    </button>
  );
};

export default PrecentChange;