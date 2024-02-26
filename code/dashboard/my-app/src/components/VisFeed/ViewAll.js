import React from 'react';

const styles = {
  Button: {
    cursor: 'pointer',
    top: '330px',
    left: '1144px',
    width: '240px',
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
  },
};

const defaultProps = {
  label: 'View all reviews',
  onClick: () => {} // Default onClick prop does nothing
};

const ViewAll = (props) => {
  // Destructure props to get label and onClick
  const { label = defaultProps.label, onClick } = props;
  
  return (
    <button style={styles.Button} onClick={onClick}>
      {label}
    </button>
  );
};

export default ViewAll;
