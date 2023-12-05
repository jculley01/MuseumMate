class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        let queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.elements.length; i++) {
            if (queueElement.priority < this.elements[i].priority) {
                this.elements.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.elements.push(queueElement);
        }
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    peek() {
        return this.elements.length > 0 ? this.elements[0] : undefined;
    }
}


module.exports = {
    PriorityQueue,
}