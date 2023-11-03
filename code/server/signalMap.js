// signalMap.js
class SignalMap {
    constructor() {
        this.userBeaconMap = {};
    }

    addSignal(userID, beaconID, signalStrength) {
        if (!this.userBeaconMap[userID]) {
            this.userBeaconMap[userID] = {};
        }
        this.userBeaconMap[userID][beaconID] = signalStrength;
    }

    updateSignal(userID, beaconID, newSignalStrength) {
        if (this.userBeaconMap[userID] && this.userBeaconMap[userID][beaconID] !== undefined) {
            this.userBeaconMap[userID][beaconID] = newSignalStrength;
            console.log(`Signal updated for user ${userID} and beacon ${beaconID}`);
        } else {
            console.log(`No existing signal for user ${userID} and beacon ${beaconID} to update.`);
        }
    }

    getSignal(userID, beaconID) {
        if (this.userBeaconMap[userID] && this.userBeaconMap[userID][beaconID] !== undefined) {
            return this.userBeaconMap[userID][beaconID];
        }
        return null;
    }

    getAllSignalsForUser(userID) {
        const signals = [];
        const beacons = this.userBeaconMap[userID];
        if (beacons) {
            for (const beaconID in beacons) {
                signals.push({ beaconID, signalStrength: beacons[beaconID] });
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
