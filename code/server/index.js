const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const os = require('os');
const rfidServer = dgram.createSocket('udp4');
const connectionServer = dgram.createSocket('udp4');
const batteryStatusServer = dgram.createSocket('udp4');
const batteryLevelServer = dgram.createSocket('udp4');
const express = require('express');
const cors=require('cors')
const fs = require('fs');
const djikstra = require('./dijkstra');
const tsp = require('./tsp');
const SignalMap = require('./signalMap');
const getObjects = require('./retrieveMedia');
const { trainKNN } = require('./knnClassifier');
const trilateration = require('./trilateration');
const { trainingData, predictionData } = require('./knnTrainingData');
const { getLocation }= require('./getLocation');
const { InfluxDB, Point, flux } = require('@influxdata/influxdb-client');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const messageWss = new WebSocket.Server({ port: 6060 });
const Minio = require('minio');
const dynamicPollPort = 3335;
const { performance } = require('perf_hooks');

const signalMap = new SignalMap();
const token = 'i8U3kPdqsPn-3SSuWsrydl9N8MeRy59JLJi-AcWJWYNzsO-jJQbrRnUK9at0snR31jHngUcXc7Dc_T1q6Q-mvg=='
const url = 'http://localhost:8086';
const client = new InfluxDB({ url, token });
const app = express();
app.use(cors())

let org = `MuseumMate`;
let bucket = `dashboard`;
let writeClient = client.getWriteApi(org, bucket, 'ns');
var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'alojQRohuxxFCNVsR6pT',
    secretKey: 'Qs5L00z0jMyy3TXbIzv4ZmVz36zhwjyur00mvL89',
})

const logFilename = 'trilateration_times.json';

let bucketAccessCounters = {};
try {
    bucketAccessCounters = JSON.parse(fs.readFileSync(COUNTERS_FILE, 'utf8'));
} catch (error) {
    console.log('Starting with new counters.');
}

const uwbDevices = {
    "1": { x: 0, y: 1.982 },
    "2": { x: 2.51, y: 7.15 },
    "3": { x: 6.7, y: 5.063 },
};

const rooms = {
    "1.1": { x1: 0, y1: 0, x2: 6.748, y2: 3.58, maxOccupancy: 30 },
    "1.2": { x1: 0, y1: 3.59, x2: 6.748, y2: 7.19, maxOccupancy: 40 },
};


let userDeviceMap = {};
let userLastRoom = {};

const preSetGraph = {
    '1.1': { '1.2': 5 },
    '1.2': { '1.1': 5 },
};


app.use(express.json());

//---------------------------------------------------

messageWss.on('connection', function connection(ws) {
    console.log('A new client connected');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});

connectionServer.on('error', (err) => {
    console.error(`server connection error:\n${err.stack}`);
    connectionServer.close();
});

connectionServer.on('listening', () => {
    const address = connectionServer.address();
    console.log(`connection server listening ${address.address}:${address.port}`);
});

connectionServer.on('message', (msg, rinfo) => {
    let message = msg.toString().trim(); // Removed slice assuming no extra char at the end
    let [userID, onlineStatus] = message.split(','); // Split the message by comma

    // Trim the values to remove any extraneous whitespace
    userID = userID.trim();
    onlineStatus = onlineStatus.trim();

    // Convert the status to a boolean integer value: 1 for online, 0 for offline/sleep
    onlineStatus = onlineStatus === '1' ? 1 : 0;

    // Create a new point for InfluxDB
    const point = new Point('connectionStatus')
        .tag('userID', userID)
        .intField('online', onlineStatus)
        .timestamp(new Date()); // Use the current time as timestamp

    // Write the point to InfluxDB
    writeClient.writePoint(point);
    writeClient.flush()
        .then(() => {
            console.log(`Successfully wrote connection status for userID ${userID} to InfluxDB.`);
        })
        .catch(err => {
            console.error(`Error writing connection status to InfluxDB: ${err}`);
        });
});

batteryStatusServer.on('error', (err) => {
    console.error(`batteryStatusServer error:\n${err.stack}`);
    batteryStatusServer.close();
});

batteryStatusServer.on('listening', () => {
    const address = batteryStatusServer.address();
    console.log(`batteryStatusServer listening ${address.address}:${address.port}`);
});

batteryStatusServer.on('message', (msg, rinfo) => {
    let message = msg.toString().trim(); // Assume no extra char at the end
    let [userID, charging, done] = message.split(','); // Split the message by comma

    // Trim the values to remove any extraneous whitespace
    userID = userID.trim();
    charging = charging.trim();
    done = done.trim();

    // Convert the charging and done status to integers
    charging = parseInt(charging, 10);
    done = parseInt(done, 10);

    // Define a status string based on the combination of charging and done
    let status;
    if (charging === 0 && done === 0) {
        status = 'not charging';
    } else if (charging === 1 && done === 0) {
        status = 'charging';
    } else if (charging === 0 && done === 1) {
        status = 'charging done';
    } else if (charging === 1 && done === 1) {
        status = 'error';
    } else {
        status = 'unknown'; // Handle unexpected combinations
    }

    // Create a new point for InfluxDB
    const point = new Point('batteryStatus')
        .tag('userID', userID)
        .intField('charging', charging)
        .intField('done', done)
        .stringField('status', status)
        .timestamp(new Date()); // Use the current time as timestamp

    // Write the point to InfluxDB
    writeClient.writePoint(point);
    writeClient.flush()
        .then(() => {
            console.log(`Successfully wrote battery status for userID ${userID} to InfluxDB.`);
        })
        .catch(err => {
            console.error(`Error writing battery status to InfluxDB: ${err}`);
        });
});

batteryLevelServer.on('error', (err) => {
    console.error(`batteryLevelServer error:\n${err.stack}`);
    batteryLevelServer.close();
});

batteryLevelServer.on('listening', () => {
    const address = batteryLevelServer.address();
    console.log(`batteryLevelServer listening ${address.address}:${address.port}`);
});

batteryLevelServer.on('message', (msg, rinfo) => {
    let message = msg.toString().trim(); // Assume no extra char at the end
    let [userID, batteryLevel] = message.split(','); // Split the message by comma

    // Trim and parse the userID and battery level
    userID = userID.trim();
    batteryLevel = parseFloat(batteryLevel.trim());

    // Check that batteryLevel is a number within the valid range
    if (isNaN(batteryLevel) || batteryLevel < 0 || batteryLevel > 100) {
        console.error(`Invalid battery level received from userID ${userID}: ${batteryLevel}`);
        return; // Skip writing invalid data to InfluxDB
    }

    // Create a new point for InfluxDB
    const point = new Point('batteryLevel')
        .tag('userID', userID)
        .floatField('level', batteryLevel)
        .timestamp(new Date()); // Use the current time as timestamp

    // Write the point to InfluxDB
    writeClient.writePoint(point);
    writeClient.flush()
        .then(() => {
            console.log(`Successfully wrote battery level for userID ${userID} to InfluxDB.`);
        })
        .catch(err => {
            console.error(`Error writing battery level to InfluxDB: ${err}`);
        });
});



//turn the server on and report any errors that occur
server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    let message = msg.toString().slice(0, -1); // Assuming your message format requires trimming the last character
    let variables = message.split(',');
    let objArr = [];

    if (variables.length % 3 == 0) { // Adjusted for sets of three variables: uwbID, userID, distance
        for (let i = 0; i < variables.length; i += 3) {
            let uwbID = variables[i].trim();
            uwbID = parseInt(uwbID, 10).toString();
            let userID = variables[i + 1].trim();
            userID = parseInt(userID, 10).toString();
            let distance = variables[i + 2].trim();

            // Update the global mapping with the latest client info
            userDeviceMap[userID] = { ip: rinfo.address, port: rinfo.port };

            // Create and process your message object as needed
            let messageObj = {
                "uwbID": uwbID,
                "userID": userID,
                "distance": distance,
            };
            objArr.push(messageObj);
        }
    }

    console.log("objArr: ", objArr);
    // Assuming signalMap.updateSignals does something with objArr
    signalMap.updateSignals(objArr, signalMap);
});


//turn the server on and begin listening for incoming data
server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

wss.on('connection', ws => {
    console.log('WebSocket client connected');

    // Function to send data to WebSocket client
    const sendToClient = (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    };

    rfidServer.on('message', (msg) => {
        console.log(`RFID server got: ${msg}`);
        let [userID, RFID] = msg.toString().split(',');
        let data = { userID: userID.trim(), RFID: RFID};
        sendToClient(data);
    });


    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

rfidServer.on('listening', () => {
    const address = rfidServer.address();
    console.log(`RFID server listening ${address.address}:${address.port}`);
});


//-------------------------------------------------------------------------------------------------------------------------------
//interval processes

console.log(trainingData.length);
const intervalId = setInterval(() => {
    if (trainingData.length === 1203) {
        clearInterval(intervalId); // Stop checking once the condition is met
        trainKNN(trainingData, predictionData); // Call your function
    }
}, 1000); // Check every 1000 milliseconds (1 second)


setInterval(() => {
    signalMap.printAllSignals();
    console.log(`The predicted location is: `, trilateration(signalMap, 1, uwbDevices, rooms));
}, 10000)

let valueToSend = 0;

setInterval(() => {
    sendMessageToDevice(1, `${valueToSend}`);
    // Flip the value between 0 and 1 for the next send
    valueToSend = 1 - valueToSend;
}, 20000);

setInterval(() => {
    signalMap.measureAndLogTrilaterationTimes(logFilename, signalMap, uwbDevices, rooms);
}, 10000); // Adjust the interval as needed


setInterval(() => {
    updateRoomOccupancy();
    updateUserRoomDurations();
}, 3000)

setInterval(() => {
    fs.writeFileSync(COUNTERS_FILE, JSON.stringify(bucketAccessCounters), 'utf8');
}, 5 * 60 * 1000); // every 5 minutes

// Save counters on graceful shutdown
process.on('SIGINT', () => {
    fs.writeFileSync(COUNTERS_FILE, JSON.stringify(bucketAccessCounters), 'utf8');
    process.exit();
});

//----------------------------------------------------
//endpoints

app.get('/location/:userID', (req, res) => {
    const userID = req.params.userID;
    // Assuming getLocation function takes userID and returns the location
    const location = trilateration(signalMap, userID, uwbDevices, rooms);
    if (location) {
        res.status(200).json({ userID: userID, location: location });
    } else {
        res.status(404).send('Location not found for given userID');
    }
});

app.get('/path/:userID', (req, res) => {
    const userID = req.params.userID;
    const endNode = req.query.endNode;

    const roomAccessPoint = new Point('room_access')
        .tag('roomID', endNode)
        .intField('count', 1);

    writeClient.writePoint(roomAccessPoint);
    writeClient.flush().catch(err => console.error('Error writing to InfluxDB', err));

    // Assuming trilateration and the dijkstra's algorithm implementation are correctly defined elsewhere
    const startNode = trilateration(signalMap, userID, uwbDevices, rooms);

    if (!startNode) {
        return res.status(404).send('Start location not found for given userID');
    }
    if (!graph[endNode]) {
        return res.status(404).send('End location not valid');
    }

    const path = djikstra.dijkstra(graph, startNode, endNode);

    if (path) {
        // Now using userID directly, assuming sendMessageToDevice handles looking up the user's device info
        sendMessageToDevice(userID, "1");
        res.status(200).json({ userID: userID, path: path });
        // Tracking the device's movement towards the end node in the background
        trackDeviceToEndNode(userID, endNode);
    } else {
        res.status(404).send('Path not found');
    }
});

//   /tsp-path and then in the request body include an object that includes userID and an array of nodes ex. {"userID": "1", "nodes": ["1.1", "2.1", "3.2"]}
app.post('/tsp-path', (req, res) => {
    const { userID, nodes } = req.body; // Extract userID and nodes array from the request body

    nodes.forEach(node => {
        const roomAccessPoint = new Point('room_access')
            .tag('roomID', node)
            .intField('count', 1); // Assuming each call increments by 1

        writeClient.writePoint(roomAccessPoint);
    });
    writeClient.flush().catch(err => console.error('Error writing to InfluxDB', err));


    if (!Array.isArray(nodes) || nodes.length === 0) {
        return res.status(400).send('Invalid nodes array.');
    }

    // Attempt to find the start location using trilateration
    const startNode = trilateration(signalMap, userID, uwbDevices, rooms);

    if (!startNode) {
        return res.status(404).send('Start location not found for given userID.');
    }

    try {
        const { shortestDistance, shortestPath } = tsp.findShortestRoute(graph, startNode, nodes);
        sendMessageToDevice(userID, "1"); // Utilize the updated sendMessageToDevice which uses userID to lookup device info

        res.status(200).json({ userID: userID, path: shortestPath, shortestDistance: shortestDistance });

        const endNode = shortestPath[shortestPath.length - 1];
        trackDeviceToEndNode(userID, endNode); // This function periodically checks the device's location and sends "slow" when it reaches endNode

    } catch (error) {
        res.status(500).send('Error calculating path: ' + error.message);
    }
});


// run this command in the directory with the minio executable to start the server: .\minio.exe server C:\minio --console-address :9090
app.get('/rfid/:bucketName', async (req, res) => {
    try {
        let bucketName = req.params.bucketName; // Get bucketName from URL parameter
        bucketName = bucketName.trim();
        const objects = await getObjects.listAllObjects(bucketName, minioClient);
        // Get the IPv4 address
        const networkInterfaces = os.networkInterfaces();
        let ipv4Address = null;

        for (const key in networkInterfaces) {
            const interface = networkInterfaces[key];
            for (const entry of interface) {
                if (entry.family === 'IPv4' && !entry.internal) {
                    ipv4Address = entry.address;
                    break;
                }
            }
            if (ipv4Address) {
                break;
            }
        }

        // Construct object data with the IPv4 address in the URL
        const objectData = objects.map(obj => {
            console.log("objectName: ",obj.name);
            return {
                name: obj.name,
                url: `http://${ipv4Address}:9000/${bucketName}/${obj.name}`
            };
        });

        res.json(objectData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving objects');
    }
});

app.post('/send-message', (req, res) => {
    const { message } = req.body;
    // Broadcast message to all connected WebSocket clients
    messageWss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message }));
        }
    });

    res.send({ status: 'Message sent to all clients' });
});

app.get('/api/popular-rooms', async (req, res) => {
    try {
        const popularRooms = await findPopularity();
        res.json(popularRooms);
    } catch (error) {
        console.error('Error retrieving popular rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/exhibit-rating', async (req, res) => {
    const { exhibit, rating } = req.body;

    // Validate input
    if (!exhibit || typeof exhibit !== 'string') {
        return res.status(400).send('Invalid exhibit name.');
    }
    if (isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).send('Rating must be a float between 0 and 5.');
    }

    try {
        // Create a point and write it to the InfluxDB
        const point = new Point('exhibitRating')
            .tag('exhibit', exhibit)
            .floatField('rating', rating);

        writeClient.writePoint(point);
        await writeClient.flush();

        res.status(200).send('Rating submitted successfully.');
    } catch (error) {
        console.error('Error writing to InfluxDB', error);
        res.status(500).send('Failed to submit rating.');
    }
});


app.use('/rfid/:bucketName', (req, res, next) => {
    const bucketName = req.params.bucketName.trim();

    // Persist the updated counter to InfluxDB
    const point = new Point('bucket_access')
        .tag('bucketName', bucketName)
        .intField('count', 1);
    writeApi.writePoint(point);
    writeApi.flush().catch(err => console.error('Error writing to InfluxDB', err));

    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//------------------------------------------------------------------------------------------------------------------
//functions

const measureTrilaterationTime = (signalMap, userID, uwbDevices, rooms) => {
    const start = performance.now();
    trilateration(signalMap, userID, uwbDevices, rooms); // Call your function
    const end = performance.now();
    return end - start; // Returns execution time in milliseconds
};

let roomOccupancyCounts = {};

function updateRoomOccupancy() {
    const roomCounts = {}; // Object to store the count of users in each room

    // Initialize roomCounts with 0 for each room
    Object.keys(rooms).forEach(room => {
        roomCounts[room] = 0;
    });

    // Iterate through each user in the signal map
    Object.keys(signalMap.userBeaconMap).forEach(userID => {
        const roomName = trilateration(signalMap, userID, uwbDevices, rooms); // Adapt parameters as needed
        if (roomName && roomCounts.hasOwnProperty(roomName)) {
            roomCounts[roomName]++;
        }
    });

    roomOccupancyCounts = roomCounts;
    // Print the room occupancy counts
    Object.entries(roomCounts).forEach(([roomName, count]) => {
        console.log(`Room: ${roomName}, Occupancy: ${count}`);
    });

    // Write the room occupancy counts to InfluxDB
    Object.entries(roomCounts).forEach(([roomName, count]) => {
        const point = new Point('roomOccupancy')
            .tag('roomName', roomName)
            .intField('count', count);
        writeClient.writePoint(point);
    });

    // Flush the write client to send the data
    writeClient.flush().catch(err => console.error('Error writing data to InfluxDB', err));
}


// Assuming this structure exists globally or is initialized somewhere relevant in your application.
let userRoomDurationsMap = {};

function updateUserRoomDurations() {
    const currentTime = Date.now();
    console.log(`Current Time: ${currentTime}`);

    Object.keys(signalMap.userBeaconMap).forEach(userID => {
        console.log(`Processing User ID: ${userID}`);
        const currentRoom = trilateration(signalMap, userID, uwbDevices, rooms);
        console.log(`Current Room for User ${userID}: ${currentRoom}`);

        // Use the dedicated map for room duration tracking
        if (!userRoomDurationsMap[userID]) {
            console.log(`Initializing record for User ${userID}`);
            userRoomDurationsMap[userID] = { currentRoom, entryTime: currentTime };
        } else {
            const userData = userRoomDurationsMap[userID];
            console.log("userData: ", userData);
            console.log(`User ${userID} was previously in room: ${userData.currentRoom}`);

            if (currentRoom !== userData.currentRoom) {
                const duration = currentTime - userData.entryTime;
                console.log(`User ${userID} moved to a new room. Duration in previous room: ${duration}ms`);

                if (userData.currentRoom) { // Ensure the previous room is not undefined
                    logRoomStayDuration(userID, userData.currentRoom, duration);
                }

                // Update the user's current room and reset the entry time
                userData.currentRoom = currentRoom;
                userData.entryTime = currentTime;
            } else {
                console.log(`User ${userID} is still in the same room: ${currentRoom}. No action needed.`);
            }
        }
    });
}

function logRoomStayDuration(userID, roomName, duration) {
    const durationInSeconds = duration / 1000;
    console.log(`Logging duration for User ${userID} in room ${roomName}. Duration: ${durationInSeconds} seconds`);

    if (isNaN(durationInSeconds)) {
        console.error(`Error: duration is NaN for userID ${userID} in room ${roomName}. Skipping log.`);
        return; // Skip logging this point
    }

    const point = new Point('roomStayDuration')
        .tag('userID', userID)
        .tag('roomName', roomName)
        .floatField('duration', durationInSeconds);
    console.log(`Point to be written for User ${userID}:`, JSON.stringify(point)); // Assuming JSON.stringify is illustrative

    writeClient.writePoint(point);
    writeClient.flush().catch(err => console.error('Error writing data to InfluxDB:', err));
}





function trackDeviceToEndNode(userID, endNode) {
    const checkInterval = setInterval(() => {
        const currentNode = trilateration(signalMap, userID, uwbDevices, rooms); // Assume this function returns the current node for the user
        if (currentNode === endNode) {
            // Device has reached the endNode
            sendMessageToDevice(userID, "0"); // Directly use userID to send the message
            clearInterval(checkInterval); 
        }
    }, 1000); // Check every 5 seconds
}

function sendMessageToDevice(userID, message) {
    const deviceInfo = userDeviceMap[userID]; // Access the global mapping
    if (deviceInfo) {
        const messageBuffer = Buffer.from(message);
        server.send(messageBuffer, 0, messageBuffer.length, dynamicPollPort, deviceInfo.ip, (err) => {
            if (err) {
                console.error(`Error sending message to ${deviceInfo.ip}:${dynamicPollPort}: ${err}`);
            } else {
                console.log(`Message "${message}" sent to ${deviceInfo.ip}:${dynamicPollPort}`);
            }
        });
    } else {
        console.log(`No device information found for userID ${userID}`);
    }
}





//------------------------------------------------------------------------------------------------------------------
//port establishment

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
    messageWss.handleUpgrade(request, socket, head, socket => {
        messageWss.emit('connection', socket, request);
    });
});

const PORT = 3333;
server.bind(PORT);
rfidServer.bind(3334);
connectionServer.bind(3330);
batteryStatusServer.bind(3331);
batteryLevelServer.bind(3332);





//----------------------------------------------------------------------
//congestion functions

function calculateDistance(roomA, roomB) {
    let centerX_A = (roomA.x1 + roomA.x2) / 2;
    let centerY_A = (roomA.y1 + roomA.y2) / 2;
    let centerX_B = (roomB.x1 + roomB.x2) / 2;
    let centerY_B = (roomB.y1 + roomB.y2) / 2;

    return Math.sqrt(Math.pow(centerX_A - centerX_B, 2) + Math.pow(centerY_A - centerY_B, 2));
}


function calculateCongestion(roomID) {
    const room = rooms[roomID];
    const currentOccupancy = roomOccupancyCounts[roomID] || 0;
    return currentOccupancy / room.maxOccupancy;
}



function updateGraphWithWeights(graph, rooms) {
    let updatedGraph = {};

    for (let roomIDA in graph) {
        updatedGraph[roomIDA] = {};

        for (let roomIDB in graph[roomIDA]) {
            if (rooms[roomIDA] && rooms[roomIDB]) { // Check if both rooms exist
                let weight = calculateWeight(rooms[roomIDA], rooms[roomIDB]);
                updatedGraph[roomIDA][roomIDB] = weight;
            }
        }
    }

    return updatedGraph;
}

function calculateWeight(roomA, roomB) {
    let distance = calculateDistance(roomA, roomB);
    let congestionA = calculateCongestion(roomA.id);
    let congestionB = calculateCongestion(roomB.id);

    // Weight formula can be adjusted as needed
    return (0.7 * distance) + (0.3 * (congestionA + congestionB) / 2);
}


let graph = updateGraphWithWeights(preSetGraph, rooms);

setInterval(() => {
    updateRoomOccupancy(); // Refresh occupancy data
    graph = updateGraphWithWeights(preSetGraph, rooms); // Update graph with dynamic weights
}, 1000); // Every second (adjust interval as necessary)


//---------------------------------------------------------------------------------
//ML Functions / Data

const visitCountWeight = 0.5;
const visitDurationWeight = 0.5;

async function findPopularity() {
    const combinedData = await prepareDataForML();
    const normalizedData = normalizeData(combinedData);

    normalizedData.forEach(room => {
        room.score = calculateWeightedScore(room);
    });

    normalizedData.sort((a, b) => b.score - a.score);
    return normalizedData;
}

async function prepareDataForML() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const startQueryTime = oneWeekAgo.toISOString();

    // Flux query to fetch room visit counts for the last week
    const visitCountQuery = flux`from(bucket: ${bucket})
      |> range(start: ${startQueryTime})
      |> filter(fn: (r) => r._measurement == "room_access")
      |> sum(column: "_value")
      |> group(columns: ["roomID"])`;

    // Flux query to fetch average stay duration per room for the last week
    const durationQuery = flux`from(bucket: ${bucket})
      |> range(start: ${startQueryTime})
      |> filter(fn: (r) => r._measurement == "roomStayDuration")
      |> mean(column: "duration")
      |> group(columns: ["roomName"])`;

    try {
        // Execute the visit count query
        const visitCounts = {};
        await queryApi.collectRows(visitCountQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                visitCounts[o.roomID] = o._value;
            },
            error(error) {
                console.error('Query for visitCounts failed', error);
                throw error;
            },
        });

        // Execute the duration query
        const durations = {};
        await queryApi.collectRows(durationQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                durations[o.roomName] = o._value;
            },
            error(error) {
                console.error('Query for durations failed', error);
                throw error;
            },
        });

        // Combine data into a single structure for ML processing
        const combinedData = Object.keys(visitCounts).map(roomID => {
            return {
                roomID: roomID,
                visitCount: visitCounts[roomID],
                averageDuration: durations[roomID] || 0, // Handle cases where there might be no duration data
            };
        });

        return combinedData;
    } catch (error) {
        console.error('Failed to prepare data for ML', error);
        throw error;
    }
}

function normalizeData(data) {
    let visitCounts = data.map(room => room.visitCount);
    let durations = data.map(room => room.averageDuration);

    let { min: minVisitCount, max: maxVisitCount } = findMinMax(visitCounts);
    let { min: minDuration, max: maxDuration } = findMinMax(durations);

    data.forEach(room => {
        room.normalizedVisitCount = (room.visitCount - minVisitCount) / (maxVisitCount - minVisitCount);
        room.normalizedAverageDuration = (room.averageDuration - minDuration) / (maxDuration - minDuration);
    });

    return data;
}

const findMinMax = (arr) => {
    let min = arr[0], max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }
    return { min, max };
};

function calculateWeightedScore(room) {
    const score = (visitCountWeight * room.visitCount) + (visitDurationWeight * room.averageDuration);
    return score;
}