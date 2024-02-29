import React from 'react';

const styles = {
  Text: {
    color: '#030303',
    fontSize: '48px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    lineHeight: '48px',
  },
};

const defaultProps = {
  text: '534 Users',
};

const UserTitles = (props) => {
  return (
    <div style={{ ...styles.Text, fontSize: '30px' }}>
      {props.text ?? defaultProps.text}
    </div>
  );

};

export default UserTitles;