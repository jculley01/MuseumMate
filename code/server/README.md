# MuseumMate Server

This server is powered by Node.js and Express.js and is built to enhance the visitor experience in museums. 

## Features

- **Real-Time Location Tracking**: Utilizes Ultra Wideband (UWB) devices and trilateration for precise indoor tracking.
- **Dynamic MultiMedia Support**: Leverages RFID to retrieve exhibit specific multimedia from MinIO.
- **Visitor Analytics**: Monitors visitor movements, room occupancies, and interaction with exhibits.
- **Path Optimization**: Provides optimal routing within the museum using Dijkstra's and TSP algorithms.
- **WebSocket Communication**: Enables real-time communication between the server and clients.
- **Data Logging and Analysis**: Stores and analyzes data using InfluxDB for real-time insights.
- **Hardware Device Integration**: Manages connections hardware components via UDP.

## Prerequisites

- Node.js
- InfluxDB
- Minio (for object storage)
- WebSocket capable clients

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/jculley01/MuseumMate.git
cd MuseumMate
cd code
cd server
npm install
node index.js
```

## Configuration

1. Ensure that InfluxDB is running and that the client information is correct
2. Ensure that MinIO is running and that the client information is correct

## API Endpoints

### General Information
GET /api/active-users: Returns the number of currently active users.
GET /api/total-users: Provides the total number of users within the last 24 hours.
GET /api/room-occupancies: Fetches the current occupancy of each room.
GET /api/exhibit-ratings: Retrieves ratings for each exhibit from the last year.
### Real-Time Tracking
GET /location/:userID: Returns the current location of a specific user.
GET /path/:userID: Provides the shortest path to a specified end node for a user.
POST /tsp-path: Calculates and returns the shortest path visiting specified nodes.
### Data Management
GET /rfid/:bucketName: Lists all objects within a specified bucket in Minio storage.
### WebSocket Endpoints
WebSocket /ws: Main WebSocket endpoint for real-time client-server communication.
WebSocket /ws/messages: Dedicated WebSocket endpoint for broadcasting messages to all clients.

## Port Usage

MuseumMate server uses multiple ports to handle different types of network communications and services. Below is a detailed breakdown of each port and its specific use:

### Core Application Ports

- **3000**: The main port used by the Express.js application for handling API requests.
- **3333**: Used by the UDP server for general incoming data.

### WebSocket Ports

- **8080**: Main WebSocket server for real-time data communication with clients.
- **6060**: Secondary WebSocket server used for message broadcasting to clients.

### UDP Server Ports

- **3330**: Dedicated for connection status updates from devices.
- **3331**: Handles battery status updates from devices.
- **3332**: Receives battery level data from connected IoT devices.
- **3334**: RFID data reception port, primarily for tracking and interactions.

### Dynamic Ports

- **3335**: Used for dynamic polling, typically for specific IoT device interactions.

### Minio Ports

- **9000**: Default port for Minio services, used for object storage and management within the local network.

### InfluxDB Ports

- **8086**: The default port for InfluxDB, used for database interactions such as writing data points and querying.

### Additional Configuration

Ensure that these ports are open and accessible on your network, especially if the server is running in a containerized environment or behind a firewall. Adjust the port numbers according to your environment's requirements and security policies.

