const getUserSignalData = require('./signalExtractor');

function trilateration(distanceMap, userID, uwbDevices, rooms) {
    const userDistanceData = getUserSignalData(distanceMap, userID);
    const closestUWBs = getThreeClosestUWBs(userDistanceData, uwbDevices);
    const coordinatePosition = trilaterate(closestUWBs[0], closestUWBs[1], closestUWBs[2]);
    const predictedLocation = findUserRoom(coordinatePosition, rooms);
    return predictedLocation;
}

function getThreeClosestUWBs(userSignalData, uwbDevices) {
    // Step 1 & 2: Filter out invalid distances and find the three smallest distances
    const validDistances = userSignalData
        .map((distance, index) => ({ distance, uwbID: `uwb${index + 1}` }))
        .filter(uwb => uwb.distance >= 0)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

    // Step 3: Create a new data structure with UWB ID, coordinates, and distance
    const closestUWBs = validDistances.map(uwb => {
        return {
            uwbID: uwb.uwbID,
            coordinates: uwbDevices[uwb.uwbID],
            distance: uwb.distance
        };
    });

    return closestUWBs;
}

function trilaterate(point1, point2, point3) {
    const xa = point1.coordinates.x;
    const ya = point1.coordinates.y;
    const xb = point2.coordinates.x;
    const yb = point2.coordinates.y;
    const xc = point3.coordinates.x;
    const yc = point3.coordinates.y;
    const ra = point1.distance;
    const rb = point2.distance;
    const rc = point3.distance;

    const S = (Math.pow(xc, 2.) - Math.pow(xb, 2.) + Math.pow(yc, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(rc, 2.)) / 2.0;
    const T = (Math.pow(xa, 2.) - Math.pow(xb, 2.) + Math.pow(ya, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(ra, 2.)) / 2.0;
    const y = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
    const x = ((y * (ya - yb)) - T) / (xb - xa);

    return { x, y };
}

function findUserRoom(userPosition, rooms) {
    for (const roomName in rooms) {
        const room = rooms[roomName];
        if (userPosition.x >= room.x1 && userPosition.x <= room.x2 &&
            userPosition.y >= room.y1 && userPosition.y <= room.y2) {
            return roomName;
        }
    }
    return "User is not in any room";
}

module.exports = {
    trilateration,
}