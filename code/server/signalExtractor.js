// userSignalDataExtractor.js

function getUserSignalData(signalMap, userID) {
    const userSignals = signalMap.getAllSignalsForUser(userID);
    let userSignalData = new Array(10).fill(-100); // Assuming you have 10 beacons

    userSignals.forEach(signal => {
        const beaconIndex = parseInt(signal.beaconID, 10) - 1;
        userSignalData[beaconIndex] = signal.signalStrength;
    });

    return userSignalData;
}

module.exports = getUserSignalData;
