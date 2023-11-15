const SignalMap = require('./signalMap');
const signalMap = new SignalMap();

let trainingData = []; // Changed to let for reassignment

signalMap.readBeaconStrengthsFromFile('trainingData.json', (err, data) => {
    if (err) {
        console.log('An error occurred:', err);
    } else {
        trainingData.length = 0; // Clear current contents
        trainingData.push(...data); // Push new data into trainingData
    }
}); 

let predictionData = [];

predictionData.push(...Array(195).fill('1.1')); // 47 times 1.1
predictionData.push(...Array(196).fill('1.2')); // 16 times 1.2
predictionData.push(...Array(194).fill('2.1')); // 38 times 2.1
predictionData.push(...Array(186).fill('2.2')); // 49 times 2.2
predictionData.push(...Array(211).fill('3.1')); // 49 times 3.1
predictionData.push(...Array(221).fill('3.2')); // 68 times 3.2


module.exports = {
    trainingData,
    predictionData
};
