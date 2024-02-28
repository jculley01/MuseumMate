import React from 'react';

const styles = {
    Card: {
        top: '611px',
        left: '330px',
        width: '750px',
        height: '400px',
        backgroundColor: '#f0f0f0',
        borderRadius: '24px',
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