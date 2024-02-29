import React from 'react';

const styles = {
  Button: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '385px',
    left: '730px',
    width: '48px',
    height: '48px',
    border: '0',
    boxSizing: 'border-box',
    borderRadius: '24px',
    color: '#ffffff',
    backgroundColor: '#5856d6',
    outline: 'none',
    marginLeft: '5px'
  },
  Icon: {
    color: '#ffffff',
    fill: '#ffffff',
    width: '18px',
    height: '18px',
    fontSize: '18px',
  },
};

const IconComponent = () => (
  <svg style={styles.Icon}  viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none">
    </path>
    <path d="m12 8.89.94 3.11h2.82l-2.27 1.62.93 3.01L12 14.79l-2.42 1.84.93-3.01L8.24 12h2.82L12 8.89M12 2l-2.42 8H2l6.17 4.41L5.83 22 12 17.31 18.18 22l-2.35-7.59L22 10h-7.58L12 2z">
    </path>
  </svg>
);

const defaultProps = {
  IconComponent,
};

const TotalIcon = (props) => {
  return (
    <button style={styles.Button}>
      {
        props.IconComponent 
          ? <props.IconComponent style={styles.Icon} /> 
          : <defaultProps.IconComponent />
      }
    </button>
  );
};

export default TotalIcon;