import React from 'react';

const styles = {
  Text: {
    color: '#030303',
    fontSize: '15px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    lineHeight: '24px',
    display: 'flex'
  },
};

const defaultProps = {
  text: 'Personalized messages to engage visitors',
};

const FooterTitle = (props) => {
  return (
    <div style={styles.Text}>
      {props.text ?? defaultProps.text}
    </div>
  );
};

export default FooterTitle;