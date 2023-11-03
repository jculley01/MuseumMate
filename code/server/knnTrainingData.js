// Function to generate a random signal strength between -40 and -90
function randomSignalStrength() {
    return Math.floor(Math.random() * (90 - 40 + 1)) - 90;
}

// Function to create a simulated training sample for a given location
function generateSampleForLocation(location) {
    let sample = [];
    for (let i = 0; i < 10; i++) { // Assuming there are 10 beacons
        sample.push(randomSignalStrength());
    }
    return sample;
}

// Generating the training set
const trainingSet = [];
const predictions = [];
const locations = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2'];

// Assuming you want 50 samples for each location
locations.forEach(location => {
    for (let i = 0; i < 50; i++) {
        trainingSet.push(generateSampleForLocation(location));
        predictions.push(location);
    }
});

module.exports = {
    trainingSet,
    predictions
};
