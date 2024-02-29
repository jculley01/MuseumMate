import React from 'react';

const styles = {
    Dropdown: {
        cursor: 'pointer',
        top: '640px',
        left: '930px',
        width: '120px',
        height: '36px',
        padding: '0px 8px',
        border: '1px solid #282828',
        boxSizing: 'border-box',
        borderRadius: '24px',
        backgroundColor: '#ffffff',
        color: '#282828',
        fontSize: '13px',
        fontFamily: 'Source Sans Pro',
        fontWeight: 600,
        lineHeight: '17px',
        outline: 'none',
        marginLeft: '600px',
        marginTop: '10px'
    },
};

const defaultProps = {
    label: 'Now',
    values: [
        'Avg This Week',
        'Avg This Month',
        'Avg This Year',
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