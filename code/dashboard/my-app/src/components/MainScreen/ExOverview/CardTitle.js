import React from 'react';

const styles = {
  Text: {
    color: '#030303',
    fontSize: '20px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    lineHeight: '32px',
    marginLeft: '20px',
    marginTop: '20px',
    alignItems: 'center',
    justifyContent: 'center'
  },
};

const defaultProps = {
  text: 'Exhibit Overview',
};

const CardTitle = ({ text, style }) => {
  const combinedStyles = { ...styles.Text, ...style };
  
  return (
    <div style={combinedStyles}>
      {text ?? defaultProps.text}
    </div>
  );
};

export default CardTitle;
