const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const SignalMap = require('./signalMap');
const { trainKNN } = require('./knnClassifier');
const { trainingData, predictionData } = require('./knnTrainingData');
const { getLocation }= require('./getLocation');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const signalMap = new SignalMap();
const token = 'ZqbPr-oJgMnp1IfrSMuks9klMNepcVuWSerh2OEoMv9R5OOFw1DEZY82JsB6kPL5TYFrXbMsukYYkS0a8DAHww==';
const url = 'http://localhost:8086';
const client = new InfluxDB({ url, token });
let org = `API-Observability`;
let bucket = `metrics`;
let writeClient = client.getWriteApi(org, bucket, 'ns');

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

const userIDs = {
    "30:ae:a4:1a:91:c2": 1
};

//---------------------------------------------------

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
    let objArr = [];
    console.log(variables.length);
    if(variables.length % 3 == 0){
    for(let i = 0; i < variables.length; i+=3){
        let beaconMac = variables[i].trim();
        let beaconID = beaconIDs[beaconMac];
        let userMac = variables[i+1].trim();
        let userID = userIDs[userMac];
        let signalStrength = variables[i+2].trim();
        let point = new Point('beaconStrength')
            .tag('beaconID', beaconID)
            .tag('userID', userID)
            .floatField('signalStrength', signalStrength);

        writeClient.writePoint(point);
        let messageObj = {
            "beaconID": beaconID,
            "userID": userID,
            "signalStrength": signalStrength
        }
        objArr.push(messageObj);
    }
}
signalMap.updateSignals(objArr, signalMap);
});

//turn the server on and begin listening for incoming data
server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
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
    console.log(`The predicted location is: `, getLocation(signalMap, 1));
}, 10000)


const PORT = 3333;
server.bind(PORT);

