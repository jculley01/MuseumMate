const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const Queue = require('./Queue');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const dataQueue = new Queue();
const token = 'ZqbPr-oJgMnp1IfrSMuks9klMNepcVuWSerh2OEoMv9R5OOFw1DEZY82JsB6kPL5TYFrXbMsukYYkS0a8DAHww==';
const url = 'http://localhost:8086';
const client = new InfluxDB({ url, token })
let org = `API-Observability`;
let bucket = `testing`;
let writeClient = client.getWriteApi(org, bucket, 'ns')



//turn the server on and report any errors that occur
server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

//turn the server on and handle all of the incoming UDP messages -> {beaconID, userID, signalStrength} which is coming from the userDevice (esp32)
server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    //send the data to InfluxDB
    let point = new Point('beaconStrength')
        .tag('beaconID', msg.beaconID)
        .tag('userID', msg.userID)
        .floatField('signalStrength', msg.signalStrength);

    writeClient.writePoint(point);
    // Store the message in the data queue
    dataQueue.enqueue(msg);
});

//turn the server on and begin listening for incoming data
server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});


const PORT = 12345;
server.bind(PORT);

