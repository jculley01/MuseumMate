import React from 'react';

const styles = {
  Button: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '385px',
    left: '384px',
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
    <path d="M0 0h24v24H0z" fill="none">
    </path>
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z">
    </path>
  </svg>
);

const defaultProps = {
  IconComponent,
};

const ActiveIcon = (props) => {
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

export default ActiveIcon;