import React from 'react';

const styles = {
  Text: {
    color: '#030303',
    fontSize: '20px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    lineHeight: '32px',
  },
};

const defaultProps = {
  text: 'Exhibit Overview',
};

const CardTitle = (props) => {
  return (
    <div style={styles.Text}>
      {props.text ?? defaultProps.text}
    </div>
  );
};

export default CardTitle;