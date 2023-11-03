const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const Queue = require('./Queue');
const SignalMap = require('./signalMap');
const QueueProcessor = require('./processQueue');
const { trainKNN, predictKNN } = require('./knnClassifier');
const { trainingSet, predictions } = require('./knnTrainingData');
const getUserSignalData = require('./signalExtractor');
const { getLocation }= require('./getLocation');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const dataQueue = new Queue();
const signalMap = new SignalMap();
const queueProcessor = new QueueProcessor(dataQueue, signalMap);
const token = 'ZqbPr-oJgMnp1IfrSMuks9klMNepcVuWSerh2OEoMv9R5OOFw1DEZY82JsB6kPL5TYFrXbMsukYYkS0a8DAHww==';
const url = 'http://localhost:8086';
const client = new InfluxDB({ url, token });
let org = `API-Observability`;
let bucket = `metrics`;
let writeClient = client.getWriteApi(org, bucket, 'ns');

const beaconIDs = {
    "fc:f5:c4:06:f4:46": 1,
    "0c:dc:7e:cc:4d:a6": 2,
    "0c:dc:7e:cb:6a:b2": 3,
    "24:6f:28:76:1d:8e": 4
};
//---------------------------------------------------




setInterval(() => {
    let obj = {
        "beaconID": Math.floor(Math.random() * 10) + 1, // Random beaconID between 1-10
        "userID": Math.floor(Math.random() * 2) + 1,    // Random userID between 1-2
        "signalStrength": Math.floor(Math.random() * 51) - 90 // Random signalStrength between -40 and -90
    };
    dataQueue.enqueue(obj);
}, 100);




//turn the server on and report any errors that occur
server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

//turn the server on and handle all of the incoming UDP messages -> {beaconID, userID, signalStrength} which is coming from the userDevice (esp32)
server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    //process the data
    let message = msg.toString();
    let variables = message.split(',');

    // Assuming the message format is "beaconID,userID,signalStrength"
    let beaconMac = variables[0].trim();
    let beaconID = beaconIDs[beaconMac];
    let userID = variables[1].trim();
    let signalStrength = variables[2].trim();
    console.log("beaconID:",beaconID);
    console.log("userID: ",userID);
    console.log("signalStrength: ",signalStrength);
    //send the data to InfluxDB
    let point = new Point('beaconStrength')
        .tag('beaconID', beaconID)
        .tag('userID', userID)
        .floatField('signalStrength', signalStrength);

    writeClient.writePoint(point);
    // Store the message in the data queue
    let messageObj = {
        "beaconID": beaconID,
        "userID": userID,
        "signalStrength": signalStrength
    }
    dataQueue.enqueue(messageObj);
});

//turn the server on and begin listening for incoming data
server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});


queueProcessor.processQueue();
trainKNN(trainingSet, predictions);

setInterval(() => {
    signalMap.printAllSignals();
    console.log(`The predicted location is: `, getLocation(signalMap, 1));
}, 10000)


const PORT = 3333;
server.bind(PORT);

