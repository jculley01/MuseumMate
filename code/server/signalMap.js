// signalMap.js
class SignalMap {
    constructor() {
        this.userBeaconMap = {};
    }

    initializeSignalMap(beaconIDs, userIDs) {
        for (const userID of userIDs) {
            const userSignals = {};
            for (const beaconID of beaconIDs) {
                userSignals[beaconID] = -100;
            }
            this.userBeaconMap[userID] = userSignals;
        }
    }

    addSignal(userID, beaconID, signalStrength) {
        if (!this.userBeaconMap[userID]) {
            this.userBeaconMap[userID] = {};
        }
        this.userBeaconMap[userID][beaconID] = parseInt(signalStrength);
    }

    updateSignals(beaconDataArray) {
        // Ensure all users have all beacons set to -100 before the update
        for (let userID in this.userBeaconMap) {
            for (let i = 1; i <= 10; i++) {
                if (this.userBeaconMap[userID][i] === undefined) {
                    this.userBeaconMap[userID][i] = -100;
                }
            }
        }

        // Now, update the beacon data from the array
        for (let data of beaconDataArray) {
            this.addSignal(data.userID, data.beaconID, data.signalStrength);
        }

        // Finally, for each user, set any beacon not in the update to -100
        for (let userID in this.userBeaconMap) {
            const userBeacons = this.userBeaconMap[userID];
            const updatedBeaconIDs = beaconDataArray.map(data => data.beaconID);

            for (let i = 1; i <= 10; i++) {
                if (!updatedBeaconIDs.includes(i)) {
                    userBeacons[i] = -100;
                }
            }
        }
    }


    getSignal(userID, beaconID) {
        if (this.userBeaconMap[userID]) {
            return this.userBeaconMap[userID][beaconID];
        }
        return -100;
    }

    getAllSignalsForUser(userID) {
        const signals = [];
        const beacons = this.userBeaconMap[userID];
        if (beacons) {
            for (const beaconID in beacons) {
                signals.push({ beaconID: parseInt(beaconID), signalStrength: beacons[beaconID] });
            }
        }
        return signals;
    }

    removeSignal(userID, beaconID = null) {
        if (this.userBeaconMap[userID]) {
            if (beaconID) {
                delete this.userBeaconMap[userID][beaconID];
            } else {
                delete this.userBeaconMap[userID];
            }
        }
    }

    printAllSignals() {
        console.log('Printing all signals:');
        for (const userID in this.userBeaconMap) {
            const beacons = this.userBeaconMap[userID];
            for (const beaconID in beacons) {
                console.log(`User: ${userID}, Beacon: ${beaconID}, Signal Strength: ${beacons[beaconID]}`);
            }
        }
    }
}

module.exports = SignalMap;
