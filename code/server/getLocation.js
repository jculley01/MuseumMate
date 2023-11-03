const { trainKNN, predictKNN } = require('./knnClassifier');
const getUserSignalData = require('./signalExtractor');

function getLocation(signalMap, userID){
    const userSignalData = getUserSignalData(signalMap, userID);
    const predictedLocation = predictKNN(userSignalData);
    return predictedLocation;
}

module.exports = {
    getLocation,
}