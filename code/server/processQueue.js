// processQueue.js
const SignalMap = require('./signalMap');

class QueueProcessor {
    constructor(queue, signalMap) {
        this.queue = queue;
        this.signalMap = signalMap;
    }

    processQueue() {
        if (!this.queue.isEmpty()) {
            const message = this.queue.dequeue();
            if (message) {
                const { userID, beaconID, signalStrength } = message;
                this.signalMap.addSignal(userID, beaconID, signalStrength);
                //console.log(`Processed message for User ${userID}, Beacon ${beaconID}, Strength ${signalStrength}`);
            }
        }

        // If the queue is not empty, set up the next tick to process
        if (!this.queue.isEmpty()) {
            setImmediate(() => this.processQueue()); // Use arrow function to maintain the context of `this`
        } else {
            // Queue is empty, you might want to set a timeout or interval to check again
            //console.log("Queue is empty. Waiting for new messages...");
            setTimeout(() => this.processQueue(), 1000); // Check again after 1 second
        }
    }
}

module.exports = QueueProcessor;
