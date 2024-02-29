import React from 'react';

const styles = {
  Button: {
    cursor: 'pointer',
    top: '512px',
    left: '914px',
    width: '136px',
    height: '36px',
    padding: '0px 8px',
    border: '0',
    boxSizing: 'border-box',
    borderRadius: '24px',
    backgroundColor: '#5856d6',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 700,
    lineHeight: '16px',
    outline: 'none',
    display: 'flex',
    justifyContent: 'center', // Centers content horizontally
    alignItems: 'center', // Centers content vertically
  },
};

const defaultProps = {
  label: 'Notify visitors',
};

const NotiButton = (props) => {
  return (
    <button style={styles.Button}>
      {props.label ?? defaultProps.label}
    </button>
  );
};

export default NotiButton;