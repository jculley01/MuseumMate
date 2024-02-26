const fs = require('fs');

class SignalMap {
    constructor() {
        this.userBeaconMap = {};
    }

    // Initializes the signal map with user IDs and beacon IDs, setting default signal strength to -999
    initializeSignalMap(beaconIDs, userIDs) {
        for (const userID of userIDs) {
            const userSignals = {};
            for (const beaconID of beaconIDs) {
                userSignals[beaconID] = 999; // Use beaconID directly, allowing for non-numeric IDs
            }
            this.userBeaconMap[userID] = userSignals;
        }
    }

    // Adds or updates a signal strength for a specific user and beacon
    addSignal(userID, uwbID, signalStrength) {
        if (!this.userBeaconMap[userID]) {
            this.userBeaconMap[userID] = {};
        }
        // Use parseFloat to ensure signalStrength is treated as a floating-point number
        this.userBeaconMap[userID][uwbID] = parseFloat(signalStrength);
    }


    // Update signals based on an array of beacon data; this now directly uses beaconID without assuming numeric IDs
    updateSignals(beaconDataArray) {
        
        const usersToUpdate = new Set(beaconDataArray.map(data => data.userID));
        usersToUpdate.forEach(userID => {
            if (this.userBeaconMap[userID]) {
                // Reset user's signals to default
                const beacons = Object.keys(this.userBeaconMap[userID]);
                beacons.forEach(beaconID => {
                    this.userBeaconMap[userID][beaconID] = 999; // Set to default value
                });
            }
        });
        
        beaconDataArray.forEach(({ userID, uwbID, distance }) => {
            this.addSignal(userID, uwbID, distance);
        });

        // Fill in missing beacon signals for each user with -999
        Object.values(this.userBeaconMap).forEach(userSignals => {
            const knownBeaconIDs = Object.keys(userSignals);
            beaconDataArray.forEach(({ uwbID }) => {
                if (!knownBeaconIDs.includes(uwbID)) {
                    userSignals[uwbID] = 999;
                }
            });
        });
    }

    // Retrieves the signal strength for a specific user and beacon
    getSignal(userID, beaconID) {
        return this.userBeaconMap[userID]?.[beaconID] ?? 999;
    }

    // Retrieves all signal strengths for a specific user
    getAllSignalsForUser(userID) {
        return Object.entries(this.userBeaconMap[userID] || {}).map(([beaconID, signalStrength]) => ({
            beaconID,
            signalStrength,
        }));
    }

    // Removes a specific signal or all signals for a user
    removeSignal(userID, beaconID = null) {
        if (beaconID) {
            delete this.userBeaconMap[userID]?.[beaconID];
        } else {
            delete this.userBeaconMap[userID];
        }
    }

    // Console logs all signals for debugging purposes
    printAllSignals() {
        console.log('Printing all signals:');
        Object.entries(this.userBeaconMap).forEach(([userID, beacons]) => {
            Object.entries(beacons).forEach(([beaconID, signalStrength]) => {
                console.log(`User: ${userID}, UWB: ${beaconID}, Distance: ${signalStrength}`);
            });
        });
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
