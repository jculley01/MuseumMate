// signalMap.js
const fs = require('fs');

class SignalMap {
    constructor() {
        this.userBeaconMap = {};
    }

    initializeSignalMap(beaconIDs, userIDs) {
        for (const userID of userIDs) {
            const userSignals = {};
            for (const beaconID of beaconIDs) {
                userSignals[beaconID] = -999;
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
        // Ensure all users have all beacons set to -999 before the update
        for (let userID in this.userBeaconMap) {
            for (let i = 1; i <= 10; i++) {
                if (this.userBeaconMap[userID][i] === undefined) {
                    this.userBeaconMap[userID][i] = -999;
                }
            }
        }

        // Now, update the beacon data from the array
        for (let data of beaconDataArray) {
            this.addSignal(data.userID, data.beaconID, data.signalStrength);
        }

        // Finally, for each user, set any beacon not in the update to -999
        for (let userID in this.userBeaconMap) {
            const userBeacons = this.userBeaconMap[userID];
            const updatedBeaconIDs = beaconDataArray.map(data => data.beaconID);

            for (let i = 1; i <= 10; i++) {
                if (!updatedBeaconIDs.includes(i)) {
                    userBeacons[i] = -999;
                }
            }
        }
    }


    getSignal(userID, beaconID) {
        if (this.userBeaconMap[userID]) {
            return this.userBeaconMap[userID][beaconID];
        }
        return -999;
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

    writeBeaconStrengthsToFile(filename) {
        if (typeof filename !== 'string' || filename.trim() === '') {
            console.error('Invalid or empty filename provided.');
            return;
        }

        // First, read the existing data from the file
        fs.readFile(filename, (readErr, data) => {
            let currentData = [];

            if (readErr) {
                // If the file does not exist, we'll create a new one
                if (readErr.code !== 'ENOENT') {
                    console.error('Error reading file:', readErr);
                    return;
                }
            } else {
                // If the file exists but is empty, do not attempt to parse it
                if (data.length === 0) {
                    currentData = [];
                } else {
                    // Try parsing the file's content
                    try {
                        currentData = JSON.parse(data);
                    } catch (parseErr) {
                        console.error('Error parsing JSON from file:', parseErr);
                        return;
                    }
                }
            }

            // Append the new beacon strengths data
            const newData = [];
            for (const userID in this.userBeaconMap) {
                const beaconStrengths = [];
                for (let i = 1; i <= 10; i++) {
                    beaconStrengths.push(this.userBeaconMap[userID][i] !== undefined ? this.userBeaconMap[userID][i] : -999);
                }
                newData.push(beaconStrengths);
            }

            // Combine old and new data
            const combinedData = currentData.concat(newData);

            // Write the combined data back to the file
            fs.writeFile(filename, JSON.stringify(combinedData, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to file:', writeErr);
                } else {
                    console.log(`Beacon strengths appended successfully to ${filename}`);
                }
            });
        });
    }

    readBeaconStrengthsFromFile(filename, callback) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                callback(err, null);
                return;
            }

            try {
                const beaconData = JSON.parse(data);
                callback(null, beaconData);
            } catch (parseErr) {
                console.error('Error parsing JSON from file:', parseErr);
                callback(parseErr, null);
            }
        });
    }


}

module.exports = SignalMap;
