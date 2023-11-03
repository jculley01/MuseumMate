const KNN = require('ml-knn');

let knn;

function trainKNN(trainingSet, predictions, k = 3) {
    knn = new KNN(trainingSet, predictions, { k });
}

function predictKNN(newUserSignalData) {
    if (!knn) {
        throw new Error('KNN has not been trained yet!');
    }
    return knn.predict(newUserSignalData);
}

module.exports = {
    trainKNN,
    predictKNN
};
