import React from 'react';

const styles = {
    Card: {
        top: '611px',
        left: '330px',
        width: '54vw',
        height: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: '24px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'
    },
};

const Card = (props) => {
    return (
        <div style={styles.Card}>
            {props.children}
        </div>
    );
};

export default Card;