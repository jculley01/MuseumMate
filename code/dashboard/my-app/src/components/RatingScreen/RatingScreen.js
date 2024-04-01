import React, {useState} from 'react';
import { Rate, Row, Col, Button } from 'antd'; // Import necessary components

// Mock data
const exhibitsData = [
  {
    id: 1,
    name: 'Mona Lisa',
    room: 'Room - 2.1',
    rating: 5,
    lastUpdated: '15m',
  },
  {
    id: 2,
    name: 'Starry Night',
    room: 'Room - 2.1',
    rating: 5,
    lastUpdated: '15m',
  },
  {
    id: 3,
    name: 'Portrait of T.Little',
    room: 'Room - 2.1',
    rating: 4.5,
    lastUpdated: '15m',
  },
  {
    id: 4,
    name: 'Scream',
    room: 'Room - 2.1',
    rating: 3,
    lastUpdated: '15m',
  }
];

// Rating component

const RatingStars = ({ rating }) => {
    return (
      <Rate
        allowHalf
        defaultValue={rating}
        disabled // Add this prop if you do not want users to interact with the rating
        style={{ fontSize: '20px', color: '#000' }} // Adjust the style as needed
      />
    );
  };
  

  const RatingScreen = () => {
    // State for the filtered rating
    const [filterRating, setFilterRating] = useState(0);
    // State for the filtered exhibits
    const [filteredExhibits, setFilteredExhibits] = useState(exhibitsData);
  
    // Function to update filter rating
    const handleRateChange = (value) => {
      setFilterRating(value);
    };
  
    // Function to apply the filter
    const handleFilter = () => {
      setFilteredExhibits(
        exhibitsData.filter(exhibit => exhibit.rating >= filterRating)
      );
    };
  
    // Function to reset the filter
    const handleReset = () => {
      setFilterRating(0);
      setFilteredExhibits(exhibitsData);
    };
  
    // Inline styles
    const screenStyle = {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '20px',
    };
  
    const boxStyle = {
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      width: '73%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px',
      overflow: 'hidden',
    };

    const rateboxStyle = {
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '23%',
        boxSizing: 'border-box',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        marginBottom: '20px',
        overflow: 'hidden',
      };

      const itemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        marginLeft:'70px'
      };
    
      const itemTextContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      };
    
      const itemNameStyle = {
        fontWeight: '600',
        fontSize: '22px',
      };
    
      const itemDetailStyle = {
        color: '#000000',
        fontSize: '16px',
        fontWeight: '400',
        marginTop: '5px',
      };
    
      const starsStyle = {
        color: '#000000',
        fontSize: '40px',
        display: 'flex',
        alignItems: 'center',
      };
    
      const lastUpdatedStyle = {
        color: '#7f7fff',
        marginLeft: '10px',
        fontSize: '16px',
      };
    
      const buttonStyle = {
        backgroundColor: '#7f7fff',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        marginRight: '5px',
        cursor: 'pointer',
      };
  

   return (
    <div style={screenStyle}>
      <div style={boxStyle}>
        <h2>Real-time</h2>
        {filteredExhibits.map(exhibit => (
          <div key={exhibit.id} style={itemStyle}>
            <div style={itemTextContainerStyle}>
              <div style={itemNameStyle}>{exhibit.name}</div>
              <div style={itemDetailStyle}>{exhibit.room}</div>
            </div>
            <div style={{ ...starsStyle, justifyContent: 'flex-start' }}>
              <RatingStars rating={exhibit.rating} />
              <span style={lastUpdatedStyle}>{exhibit.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={rateboxStyle}>
        <h2>Filter</h2>
        <Rate
          allowHalf
          value={filterRating}
          onChange={handleRateChange}
          style={{ fontSize: '20px', color: '#000', marginBottom: '20px' }}
        />
        <Row gutter={16}>
          <Col>
            <Button style={buttonStyle} onClick={handleFilter}>
              Filter
            </Button>
          </Col>
          <Col>
            <Button style={buttonStyle} onClick={handleReset}>
              Reset
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RatingScreen;