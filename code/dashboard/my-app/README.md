# Administrator Dashboard

The MuseumMate Dashboard is a React-based application designed to provide real-time insights into museum operations, including visitor tracking, exhibit interactions, and room capacities. This document outlines the setup, features, and API interactions of the dashboard.

## Getting Started

### Prerequisites
- Node.js (v12.x or higher)
- npm (v6.x or higher)
- Access to server APIs

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/jculley01/MuseumMate.git
   cd code
   cd dashboard
   cd my-app
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Application:**
   ```bash
   npm start
   ```

This will run the code in development mode. Open http://localhost:3001 to view in browser.

## Application Structure

The dashboard is structured into several main components, each responsible for a different aspect of the museum's operations:

- ExhibitOverview: Displays active users and total visitors today.
- VisitorFeedLink: Links to visitor feedback and interactions.
- RoomCapacityChart: Shows current room capacities and historical data.
- Sidebar: Navigation for accessing different sections of the dashboard.
- PopularExhibits: Lists the most interacted with exhibits.
- RoomOverview: Detailed view for each room, including visitor counts and stay duration.

## API Endpoints
The dashboard interacts with several endpoints from the server which can be found in /code/server. 

### Active Users
- **Endpoint**: `GET /api/active-users`
- **Description**: Returns the number of currently active users.
- **Response Example**:
  ```json
  { "activeUsers": 53 }
  ```

### Total Users
- **Endpoint**: `GET /api/total-users`
- **Description**: Provides the total number of users within the last 24 hours.
- **Response Example**:
  ```json
  { "totalUsers": 53 }
  ```

### Room Occupancies
- **Endpoint**: `GET /api/room-occupancies`
- **Description**: Fetches the current occupancy of each room.
- **Response Example**:
  ```json
    [
        { "roomID": "1", "occupancy": 30 },
        { "roomID": "2", "occupancy": 20 }
    ]
  ```

### Exhibit Ratings
- **Endpoint**: `GET /api/exhibit-ratings`
- **Description**: Retrieves ratings for each exhibit from the last year.
- **Response Example**:
  ```json
    [
        { "exhibit": "The Age of Dinosaurs", "rating": 4.5, "time": "2023-09-01T12:00:00Z" }
    ]
  ```

### Room Stats
- **Endpoint**: `GET /api/room-stats/:timePeriod`
- **Description**: Provides statistics for room visits and durations based on the specified time period.
- **Response Example**:
  ```json
    [
        { "roomName": "Main Hall", "totalVisits": 150, "averageDuration": 35 }
    ]
  ```

## Development

To add a new component:

- Create a new component: Place it under `src/components`
- Integrate the component: Import and use it in `App.js` or other components as needed. 