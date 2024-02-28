import './App.css';
import ExhibitOverview from './components/ExOverview/ExhibitOverview';
import VisitorFeedLink from './components/VisFeed/VisitorFeedLink';
import RoomCapacityChart from './components/OccuGraph/RoomCapacityChart';
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

function App() {
  return (
    <div className="App">
      <div className="top-section">
        <ExhibitOverview data={mockData.exhibitOverview} />
        <VisitorFeedLink />
      </div>
      <RoomCapacityChart />
    </div>
  );
}

export default App;
