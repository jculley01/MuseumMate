import './App.css';
import ExhibitOverview from './components/ExOverview/ExhibitOverview';
import VisitorFeedLink from './components/VisFeed/VisitorFeedLink';
import RoomCapacityChart from './components/OccuGraph/RoomCapacityChart';
import Sidebar from './components/Sidebar';
import { ConfigProvider } from 'antd';
import PopularExhibits from './components/PopExh/PopularExhibits';
let mockData={
  "exhibitOverview": {
    "activeUsers": 534,
    "totalToday": 1424
  },
  "visitorFeedback": [
    // ... list of feedback objects
  ],
  "roomCapacity": [
    // ... list of room capacity objects
  ],
  "floorPlans": [
    // ... list of floor plan objects
  ]
}


// Define your custom theme
const theme = {
  token: {
    "colorPrimary": "#5856d6",
    "colorInfo": "#5856d6"
    // other tokens like colorPrimaryHover or colorPrimaryActive can also be set here
  },
};




function App() {
  return (
    <ConfigProvider theme={theme}>
      <div className="App">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <div className="top-section">
          <div className="left-panel">
            <ExhibitOverview data={mockData.exhibitOverview} />
          </div>
          <div className="right-panel">
            <VisitorFeedLink />
           <div className="right-sub">
              <PopularExhibits/>
            </div>
          </div>
        </div> 
        <div className='RoomCapacityChart'>
          <RoomCapacityChart />
        </div>
        
      </div>
    </div>
    </ConfigProvider>
    
  );
}



export default App;
