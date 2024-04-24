# MuseumMate

## Executive Summary

MuseumMate is an advanced indoor navigation and exhibit interaction system, designed to enrich museum visits. Upon entering a museum, visitors receive a handheld device, the TourTag, which detects Ultra-wideband (UWB) signals from beacons placed throughout the premises. This device transmits signal strengths to a server to pinpoint the visitor's location, facilitating precise navigation through a user-friendly web application. Additionally, RFID tags on exhibits interact with the TourTags, allowing visitors to automatically access rich multimedia content about the exhibits they are near, thus enhancing their educational and interactive experience in the museum. This system seamlessly integrates efficient navigation with engaging exhibit exploration, revolutionizing the traditional museum visit.

## Context

MuseumMate utilizes a blend of Ultra-Wideband (UWB) and Radio Frequency Identification (RFID) technologies to streamline visitor flow and provide immersive educational content. The system's core components include:

### UWB Beacons (ESP32 UWB DW3000)
 
These beacons are utilized with trilateration to provide location accuracy within 10 centimeters , facilitating real-time, room-by-room navigation and helping to manage museum traffic by suggesting alternative routes to avoid congestion.

### RFID Tags

Attached to each exhibit, these tags work in tandem with TourTags—portable user devices that visitors carry. When a visitor approaches an exhibit, the TourTag scans the RFID tag to fetch multimedia content related to the exhibit.

### Server Technology

- Node.js with Express.js: Powers the backend infrastructure facilitating efficient data handling and communications.
- MinIO: A high-performance storage solution that manages the multimedia files which visitors access through their TourTags.
- InfluxDB: A time-series database optimized for storing and retrieving real-time metrics that help museum staff monitor and optimize visitor traffic patterns.

### TourTag Device

This custom-designed portable device features a compact PCB that includes all necessary hardware ports and connects to visitors' phones via a MagSafe-compatible enclosure, enhancing portability and ease of use.

## Special Features

- Advanced Navigation Algorithms: Utilizing Dijkstra's and the Traveling Salesman Problem (TSP) algorithms, MuseumMate provides optimized routing solutions that dynamically adjust to the visitor's location and crowd conditions, ensuring minimal wait times and balanced visitor distribution throughout the museum.
- RFID Multimedia Support: Each exhibit's RFID tag allows visitors to access a wide array of multimedia resources, such as audio descriptions, subtitled videos, and high-resolution images, enhancing the learning experience. This feature is particularly beneficial for visitors with physical impairments, as it supports 13 different languages, text-to-speech, and a ChatGPT AI Assistant.
- Real-Time Data Processing: With real-time analytics powered by InfluxDB, MuseumMate delivers instant insights to museum staff, enabling them to make informed decisions about exhibit openings and traffic management.
- Interactive Dashboard: A React-based web application that uses ApexCharts to visualize data from InfluxDB, providing staff with user-friendly interfaces to monitor museum operations effectively.
- Mobile Application: Developed using React Native, the mobile app is an integral part of the visitor experience, offering intuitive navigation, exhibit information, and easy access to personalized multimedia content.

## System Architecture

### Location Services Data Flow
In a museum, UWB (Ultra-Wideband) beacons are strategically positioned across various locations to ensure comprehensive coverage. These beacons constantly transmit signals that are picked up by a device known as the TourTag. This device collects a substantial number of signal readings, which are then sent to a Node.js server via UDP for processing. Upon receiving the data, the server updates the distance measurements from the corresponding beacons and employs trilateration with the three nearest beacons to compute the x,y coordinates of the TourTag. This location data is used to determine the specific room within the museum where the user is located. For visitors using the mobile app who wish to know their current location, the app queries a REST API endpoint. This endpoint responds with the room location based on the latest coordinates calculated for their TourTag. To facilitate efficient navigation through the museum, the server utilizes Dijkstra's algorithm for point-to-point routing and the Traveling Salesperson Problem (TSP) algorithm for routing through multiple nodes. The museum's layout is represented as a weighted adjacency graph, where the weights are calculated based on the Euclidean distances between rooms. Additionally, the graph dynamically adjusts by incorporating the current occupancy percentage of each room. This feature ensures that the routing suggestions can help visitors avoid crowded areas, thereby optimizing the flow of museum traffic and enhancing the visitor experience.

### Multimedia Data Flow

In the museum, each piece of artwork or exhibit is equipped with a unique RFID tag placed in its vicinity. Visitors interact with these RFID tags using their TourTag, a device that attaches to their smartphone via MagSafe. When a visitor taps their TourTag against an RFID tag, the action triggers the transmission of the RFID data to the Node.js server via UDP. This data includes the specific RFID that was tapped and identifies which TourTag was used. To notify the visitor's mobile app of the interaction, the server utilizes a WebSocket connection. This real-time communication channel informs the app about the specific RFID interaction triggered by the user. Following this notification, the mobile app makes a request to a REST API endpoint on the server. This API endpoint is responsible for retrieving multimedia content related to the RFID tag from MinIO, a high-performance object storage service. The server queries MinIO, obtains the multimedia files associated with the RFID, and generates URLs for these resources. It then sends these URLs back to the mobile app, allowing the app to display relevant multimedia content directly to the visitor. This seamless integration of RFID technology, mobile connectivity, and real-time data handling enhances the visitor's experience by providing instant access to rich multimedia content related to each exhibit they explore.

### Metrics/Data Transmission

nfluxDB, a specialized time series database, plays a crucial role in managing and storing all system metrics gathered from the hardware and the analytics data displayed on the dashboard. Each TourTag device communicates with the server via UDP, transmitting key information such as connection status, battery status, and battery level. The server processes and stores these metrics in InfluxDB. Additionally, the server captures and logs visitor data for dashboard insights, including room occupancy and duration of stay. These metrics are derived from internal server processes and subsequently stored in InfluxDB. Another important metric, exhibit ratings, is also stored in InfluxDB. Visitors can rate exhibits by scanning an RFID tag with their TourTag and submitting a 0-5 star review through a REST API endpoint, which the server then records in the database. This comprehensive data collection and storage system enables real-time monitoring and analytics to enhance visitor experience and operational efficiency.

![image](https://github.com/jculley01/MuseumMate/assets/113144839/2dba16a7-c842-4802-b65b-12b0bc44c731)


## System and Visitor Metrics in InfluxDB

### System Metrics

#### Connection Status
- **Measurement Name**: `connectionStatus`
- **Tags**:
  - `userID`: Identifies the user.
- **Fields**:
  - `online`: Binary value (1 for online, 0 for offline or asleep).
- **Context**: Captured via messages from the `connectionServer` to log the active connection status of user devices.

#### Battery Status
- **Measurement Name**: `batteryStatus`
- **Tags**:
  - `userID`: Identifies the user associated with the update.
- **Fields**:
  - `charging`: Indicates if the device is charging (1) or not (0).
  - `done`: Indicates if charging is complete (1) or not (0).
  - `status`: Describes the charging state (e.g., charging, not charging, charging done, error).
- **Context**: Logged upon receiving battery status updates via the `batteryStatusServer`.

#### Battery Level
- **Measurement Name**: `batteryLevel`
- **Tags**:
  - `userID`: Links to the specific user.
- **Fields**:
  - `level`: Represents the battery level as a percentage from 0 to 100.
- **Context**: Updates are received from the `batteryLevelServer` and monitored in real-time.

### Visitor Metrics

#### Room Access
- **Measurement Name**: `room_access`
- **Tags**:
  - `roomID`: Identifier for the accessed room.
- **Fields**:
  - `count`: Incremental counter, generally set to 1, to record accesses.
- **Context**: Logged during path calculations in the `/path/:userID` endpoint and during POST requests to `/tsp-path`.

#### Room Occupancy
- **Measurement Name**: `roomOccupancy`
- **Tags**:
  - `roomName`: Identifier for the room.
- **Fields**:
  - `count`: Current number of users in the room.
- **Context**: Periodically updated to reflect dynamic room occupancies based on user locations deduced from signal strength data.

#### Room Stay Duration
- **Measurement Name**: `roomStayDuration`
- **Tags**:
  - `userID`: Identifies the user.
  - `roomName`: Specifies the room.
- **Fields**:
  - `duration`: Time (in seconds) spent by the user in the room.
- **Context**: Recorded when users change rooms, as calculated by the `updateUserRoomDurations` function.

#### Exhibit Rating
- **Measurement Name**: `exhibitRating`
- **Tags**:
  - `exhibit`: Name of the exhibit being rated.
- **Fields**:
  - `rating`: Rating given by a user, scaled from 0 to 5.
- **Context**: Captured when a visitor rates an exhibit after scanning its RFID tag with their TourTag, sent via a REST API call to `/api/exhibit-rating`.

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

## Relevant Engineering Standards for MuseumMate System

### Electrical Design and Construction

#### IEEE 1547
- **Description**: This standard outlines requirements for the integration and interoperability of distributed energy resources with electrical power systems.
- **Impact**: Ensures that electrical components like TourTag and Beacon devices meet safety and performance criteria when connected to the electrical grid.

#### National Electrical Safety Code (NESC)
- **Description**: Provides guidelines for the safe installation, operation, and maintenance of electrical power and communication utilities.
- **Impact**: Guarantees the safety of MuseumMate's electrical components for both end-users and service personnel.

### Software Design and Coding Standards

#### MISRA C
- **Description**: Compliance with MISRA C guidelines ensures the reliability, maintainability, and portability of the C code used in embedded systems.
- **Impact**: Critical for developing the firmware for TourTag and Beacon devices.

#### React Native Framework
- **Description**: Adherence to best practices in React Native for building the app.
- **Impact**: Optimizes performance and compatibility across Android and iOS platforms.

#### Expo Managed Workflow
- **Description**: Uses the managed workflow by Expo, which simplifies much of the app configuration.
- **Impact**: Lowers the barrier to entry for developers and ensures the use of industry-standard approaches.

### Communication and Internet Protocols

#### IEEE 802.11
- **Description**: Standards for wireless local area network (WLAN) communications.
- **Impact**: Essential for the WiFi communication of TourTag devices, ensuring compatibility and security.

#### ISO/IEC 14443
- **Description**: Standard for short-range wireless connectivity, used in contactless systems.
- **Impact**: Key for identification and access control.

#### ISO/IEC 24730-5
- **Description**: Addresses real-time locating systems (RTLS) using Ultra-Wideband (UWB) technology.
- **Impact**: Emphasizes interoperability and compatibility across devices.

#### IEEE 802.15.4z-2020
- **Description**: Enhanced UWB Physical Layers (PHYs) and ranging techniques.
- **Impact**: Crucial for precise indoor positioning and communication in low-rate wireless networks.

#### WebSockets for Real-Time Communication
- **Description**: Enables efficient real-time data communication with minimal overhead and latency.

#### HTTPS/TLS 1.3
- **Description**: Ensures the latest security standards for transmitting data securely over the Internet.
- **Impact**: Protects user data from interception and tampering.

### Operational Environment and Governmental Requirements

#### IEC 61131-3
- **Description**: Defines programming languages for PLCs in industrial settings.
- **Impact**: Ensures adherence to industrial best practices for safety and reliability.

#### ISO/IEC 18305
- **Description**: Methodology for testing and evaluating indoor positioning systems.
- **Impact**: Guarantees performance and reliability in operational environments.

#### FCC Regulations
- **Description**: Federal Communications Commission regulations for devices emitting radio frequencies.
- **Impact**: Prevents interference and ensures compliance with exposure limits.

### API and Integration Standards

#### RESTful API Conventions
- **Description**: Best practices for API design.
- **Impact**: Ensures effective communication with back-end services in a stateless, cacheable, and uniform manner.

#### JSON:API Specification for APIs
- **Description**: Standard for building APIs in JSON.
- **Impact**: Simplifies code, enhances efficiency, and facilitates better server-client interactions.

### User Interface and Accessibility

#### Material Design and Human Interface Guidelines
- **Description**: Design guidelines for Android (Material Design) and iOS (Human Interface Guidelines).
- **Impact**: Improves user experience and interface intuitiveness, ensuring a native look and feel on each platform.
