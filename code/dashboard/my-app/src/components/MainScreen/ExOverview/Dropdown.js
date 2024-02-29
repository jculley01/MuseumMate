import React from 'react';

const styles = {
  Dropdown: {
    cursor: 'pointer',
    top: '18.375rem',
    left: '58.125rem',
    width: '7.5rem',
    height: '2.25rem',
    padding: '0rem 0.5rem',
    border: '0.0625rem solid #282828',
    boxSizing: 'border-box',
    borderRadius: '24px',
    backgroundColor: '#ffffff',
    color: '#282828',
    fontSize: '13px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    lineHeight: '17px',
    outline: 'none',
  },
};

const defaultProps = {
  label: 'This month',
  values: [
    'Option 1',
    'Option 2',
    'Option 3',
  ],
};

const Dropdown = (props) => {
  return (
    <select style={styles.Dropdown} defaultValue="">
      <option value="" disabled hidden>{props.label ?? defaultProps.label}</option>
      {(props.values ?? defaultProps.values).map((value) => (
        <option value={value} key={value}>{value}</option>
      ))}
    </select>
  );
};

export default Dropdown;