import './App.css';
import ExhibitOverview from './components/MainScreen/ExOverview/ExhibitOverview';
import VisitorFeedLink from './components/MainScreen/VisFeed/VisitorFeedLink';
import RoomCapacityChart from './components/MainScreen/OccuGraph/RoomCapacityChart';
import Sidebar from './components/MainScreen/Sidebar';
import { ConfigProvider } from 'antd';
import PopularExhibits from './components/MainScreen/PopExh/PopularExhibits';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomOverview from './components/RoomScreen/RoomOverview';
import Menubar from './components/Menubar';
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
    <Router>
      <ConfigProvider theme={theme}>
        <div className="App">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="main-content">
        <Menubar/>
            <Routes>
              <Route path="/" element={
                <>
                  <div className="top-section">
                    <div className="left-panel">
                      <ExhibitOverview data={mockData.exhibitOverview} />
                    </div>
                    <div className="right-panel">
                      <div className="visitor-feed-link">
                        <VisitorFeedLink />
                      </div>
                      <PopularExhibits />
                    </div>
                  </div>
                  <div className='RoomCapacityChart'>
                    <RoomCapacityChart />
                  </div>
                </>
              } />
              <Route path="/room-overview" element={<RoomOverview />} />
            </Routes>
          </div>
        </div>
      </ConfigProvider>
    </Router>
  );
}
    



export default App;
