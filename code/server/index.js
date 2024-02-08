const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const os = require('os');
const rfidServer = dgram.createSocket('udp4');
const express = require('express');
const djikstra = require('./dijkstra');
const tsp = require('./tsp');
const SignalMap = require('./signalMap');
const getObjects = require('./retrieveMedia');
const { trainKNN } = require('./knnClassifier');
const trilateration = require('./trilateration');
const { trainingData, predictionData } = require('./knnTrainingData');
const { getLocation }= require('./getLocation');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const Minio = require('minio');

const signalMap = new SignalMap();
const token = 'ZqbPr-oJgMnp1IfrSMuks9klMNepcVuWSerh2OEoMv9R5OOFw1DEZY82JsB6kPL5TYFrXbMsukYYkS0a8DAHww==';
const url = 'http://localhost:8086';
const client = new InfluxDB({ url, token });
const app = express();
let org = `API-Observability`;
let bucket = `metrics`;
let writeClient = client.getWriteApi(org, bucket, 'ns');
var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'Fzmxk29NK7mhfEsEQ7l5',
    secretKey: 'lTpuETaLkJawA0FziIeDeGxZnvrKKalDnO5fu9iT',
})

const beaconIDs = {
    "0c:dc:7e:cb:6a:b2": 1,
    "24:6f:28:76:1d:8e": 2,
    "0c:dc:7e:cc:4d:3a": 3,
    "0c:dc:7e:cc:4d:a6": 4,
    "b8:f0:09:95:93:12": 5,
    "44:17:93:5e:f7:b2": 6,
    "0c:dc:7e:cb:46:b6": 7,
    "fc:f5:c4:16:a3:fe": 8,
    "0c:dc:7e:cb:06:82": 9,
    "fc:f5:c4:07:65:6e": 10
};

const uwbDevices = {
    "1": { x: 0, y: 0 },
    "2": { x: 3.89, y: 2.90 },
    "3": { x: 3.13, y: 6.25 },
};

const rooms = {
    "room1": { x1: 0, y1: 0, x2: 5, y2: 5 },
    "room2": { x1: 6, y1: 0, x2: 10, y2: 5 },
};

const RFIDs = {
    "360684124195": "1",
    "1060675152451": "2",
    "919031897443": "3",
    "1065112304211": "4",
    "184628849091": "5",
    "1026457053987": "6"
};




const graph = {
    '1.1': { '1.2': 5 },
    '1.2': { '1.1': 5, '2.1': 5 },
    '2.1': { '1.2': 5, '2.2': 5 },
    '2.2': { '2.1': 5, '3.1': 10 },
    '3.1': { '2.2': 10, '3.2': 5 },
    '3.2': { '3.1': 5 }
};

const userIDs = {
    "30:ae:a4:1a:91:c2": 1,
    "30:ae:a4:28:c2:16": 2,
    "0c:dc:7e:cb:17:1a": 3,
    "fc:f5:c4:06:f4:46": 4
};

app.use(express.json());

//---------------------------------------------------

//turn the server on and report any errors that occur
server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

//turn the server on and handle all of the incoming UDP messages -> {beaconID, userID, signalStrength} which is coming from the userDevice (esp32)
// server.on('message', (msg, rinfo) => {
//     //process the data
//     let message = msg.toString();
//     let variables = message.split(',');
//     let objArr = [];
//     console.log(variables.length);
//     if(variables.length % 3 == 0){
//     for(let i = 0; i < variables.length; i+=3){
//         let beaconMac = variables[i].trim();
//         let beaconID = beaconIDs[beaconMac];
//         let userMac = variables[i+1].trim();
//         let userID = userIDs[userMac];
//         let signalStrength = variables[i+2].trim();
//         let point = new Point('beaconStrength')
//             .tag('beaconID', beaconID)
//             .tag('userID', userID)
//             .floatField('signalStrength', signalStrength);

//         writeClient.writePoint(point);
//         let messageObj = {
//             "beaconID": beaconID,
//             "userID": userID,
//             "signalStrength": signalStrength
//         }
//         objArr.push(messageObj);
//     }
// }
// signalMap.updateSignals(objArr, signalMap);
// });

server.on('message', (msg, rinfo) => {
    //process the data
    let message = msg.toString();
    console.log(message);
    let variables = message.split(',');
    let objArr = [];
    console.log(variables.length);
    if (variables.length % 3 == 0) {
        for (let i = 0; i < variables.length; i += 3) {
            let uwbID = variables[i].trim();
            uwbID = parseInt(uwbID, 10).toString();
            let userID = variables[i + 1].trim();
            userID = parseInt(userID, 10).toString();
            let distance = variables[i + 2].trim();
            let point = new Point('uwbDistance')
                .tag('uwbID', uwbID)
                .tag('userID', userID)
                .floatField('distance', distance);

            writeClient.writePoint(point);
            let messageObj = {
                "uwbID": uwbID,
                "userID": userID,
                "distance": distance
            }
            objArr.push(messageObj);
        }
    }
    console.log(objArr);
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



//----------------------------------------------------
//endpoints

app.get('/location/:userID', (req, res) => {
    const userID = req.params.userID;
    // Assuming getLocation function takes userID and returns the location
    const location = getLocation(signalMap, userID);
    if (location) {
        res.status(200).json({ userID: userID, location: location });
    } else {
        res.status(404).send('Location not found for given userID');
    }
});

app.get('/path/:userID', (req, res) => {
    const userID = req.params.userID;
    const endNode = req.query.endNode;
    const startNode = getLocation(signalMap, userID);

    if (!startNode) {
        return res.status(404).send('Start location not found for given userID');
    }
    if (!graph[endNode]) {
        return res.status(404).send('End location not valid');
    }

    const path = djikstra.dijkstra(graph, startNode, endNode);

    if (path) {
        res.status(200).json({ userID: userID, path: path });
    } else {
        res.status(404).send('Path not found');
    }
});


//   /tsp-path and then in the request body include an object that includes userID and an array of nodes ex. {"userID": "1", "nodes": ["1.1", "2.1", "3.2"]}
app.post('/tsp-path', (req, res) => {
    const { userID, nodes } = req.body; // Extract userID and nodes array from the request body
    if (!Array.isArray(nodes) || nodes.length === 0) {
        return res.status(400).send('Invalid nodes array: ');
    }

    const startNode = getLocation(signalMap, userID); // Find the start location

    if (!startNode) {
        return res.status(404).send('Start location not found for given userID');
    }
    
    try {
        const { shortestDistance, shortestPath } = tsp.findShortestRoute(graph, startNode, nodes); // Destructuring to get shortestPath and minWeight
        res.status(200).json({ userID: userID, path: shortestPath, shortestDistance: shortestDistance });
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




const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const PORT = 3333;
server.bind(PORT);
rfidServer.bind(3334);

