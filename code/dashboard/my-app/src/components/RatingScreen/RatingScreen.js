import React, {useState, useEffect} from 'react';
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
    room: 'Room - 2.2',
    rating: 4.5,
    lastUpdated: '30m',
  },
  {
    id: 3,
    name: 'The Last Supper',
    room: 'Room - 2.3',
    rating: 4,
    lastUpdated: '45m',
  },
  {
    id: 4,
    name: 'The Scream',
    room: 'Room - 2.4',
    rating: 5,
    lastUpdated: '1h',
  },
  {
    id: 5,
    name: 'Guernica',
    room: 'Room - 3.1',
    rating: 3.5,
    lastUpdated: '2h',
  },
  {
    id: 6,
    name: 'The Persistence of Memory',
    room: 'Room - 3.2',
    rating: 5,
    lastUpdated: '3h',
  },
  {
    id: 7,
    name: 'The Night Watch',
    room: 'Room - 3.3',
    rating: 4.5,
    lastUpdated: '4h',
  },
  {
    id: 8,
    name: 'The Great Wave off Kanagawa',
    room: 'Room - 3.4',
    rating: 4,
    lastUpdated: '5h',
  },
  {
    id: 9,
    name: 'The Birth of Venus',
    room: 'Room - 4.1',
    rating: 5,
    lastUpdated: '6h',
  },
  {
    id: 10,
    name: 'Girl with a Pearl Earring',
    room: 'Room - 4.2',
    rating: 4.5,
    lastUpdated: '7h',
  },
  {
    id: 11,
    name: 'American Gothic',
    room: 'Room - 4.3',
    rating: 4,
    lastUpdated: '8h',
  },
  {
    id: 12,
    name: 'Nighthawks',
    room: 'Room - 4.4',
    rating: 3.5,
    lastUpdated: '9h',
  }
];

async function fetchExhibitRatings() {
  try {
      const response = await fetch('http://128.197.53.112:3000/api/exhibit-ratings');
      const data = await response.json();

      // Directly map the API data to your component's display format
      return data.map(item => ({
          name: item.exhibit,
          rating: item.rating,
          lastUpdated: timeSince(new Date(item.time))
      }));
  } catch (error) {
      console.error("Failed to fetch exhibit ratings:", error);
  }
}


function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
      return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
      return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
      return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
      return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
      return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

// Usage example
fetchExhibitRatings().then(exhibitsData => {
  console.log(exhibitsData);
  // Here you would typically update your UI with this data
});


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
    const [exhibitsData, setExhibitsData] = useState([]);
    const [filterRating, setFilterRating] = useState(0);
    const [filteredExhibits, setFilteredExhibits] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchExhibitRatings();
                setExhibitsData(data);
                setFilteredExhibits(data);
            } catch (error) {
                console.error("Error loading data:", error);
                // Optionally set error state and display error messages here
            }
        };
        loadData();
    }, []);

    const handleRateChange = (value) => {
        setFilterRating(value);
    };

    const handleFilter = () => {
        setFilteredExhibits(
            exhibitsData.filter(exhibit => exhibit.rating >= filterRating)
        );
    };

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
      backgroundColor: '#f2f2f2',
      borderRadius: '24px',
      width: '73%',
      height:'73vh',
      boxSizing: 'border-box',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px',
      overflow: 'auto',
    };

    const rateboxStyle = {
        backgroundColor: '#f2f2f2',
        borderRadius: '24px',
        width: '23%',
        boxSizing: 'border-box',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        marginBottom: '20px',
        overflow: 'hidden',
        height:'25%'
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
        backgroundColor: '#5856d6',
        color: 'white',
        padding: '20px',
        border: 'none',
        borderRadius: '24px',
        marginRight: '5px',
        cursor: 'pointer',
        width: '136px',
        height: '36px',
        fontSize: '14px',
        fontFamily: 'Source Sans Pro',
        fontWeight: 700,
        display:'flex',
        justifyContent: 'center', // Centers content horizontally
       alignItems: 'center', // Centers content vertically
   
      };

      const rowStyle = {
        display: 'flex',
        justifyContent: 'center', // Center the buttons horizontally
        marginTop: '20px', // Add some space above the buttons
      };

      const dividerStyle = {
        height: '1px', // Thin line
        backgroundColor: '#ccc', // Gray color
        width: '100%', // Full width of the container
        margin: '10px 0', // Some vertical space before and after the divider
      };

      const divStyle = {
        backgroundColor: '#f2f2f2',
        color: '#030303',
        fontSize: '52px',
        fontFamily: 'Source Sans Pro',
        fontWeight: 600,
        lineHeight: '48px',
        marginTop: '40px',
        height: '110px',
        display: 'flex', // Make it a flex container
        alignItems: 'flex-end', // Align children to the bottom
        justifyContent: 'flex-start', // Align children to the left
        padding: '0 0 10px 10px', // Add padding at the bottom and left to offset the text a bit from the corner
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        borderRadius: '24px', // Rounded edges
        marginLeft:'2.5rem',
        width: '95.5%',
      };

   
  

   return (
    <><div>
       <div style={divStyle}>
         Visitor Insights
       </div>
     </div><div style={screenStyle}>
         <div style={boxStyle}>
           <h2>Real-time</h2>
           {filteredExhibits.map((exhibit, index) => (
             <React.Fragment key={exhibit.id}>
               <div style={itemStyle}>
                 <div style={itemTextContainerStyle}>
                   <div style={itemNameStyle}>{exhibit.name}</div>
                   <div style={itemDetailStyle}>{exhibit.room}</div>
                 </div>
                 <div style={{ ...starsStyle, justifyContent: 'flex-start' }}>
                   <RatingStars rating={exhibit.rating} />
                   <span style={lastUpdatedStyle}>{exhibit.lastUpdated}</span>
                 </div>
               </div>
               {index !== filteredExhibits.length - 1 && <div style={dividerStyle}></div>}
             </React.Fragment>
           ))}
         </div>
         <div style={rateboxStyle}>
           <h2>Filter</h2>
           <Rate
             allowHalf
             value={filterRating}
             onChange={handleRateChange}
             style={{ fontSize: '20px', color: '#000', marginBottom: '20px' }} />
           <Row style={rowStyle}>
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
       </div></>
  );
};

export default RatingScreen;