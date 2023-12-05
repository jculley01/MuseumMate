const PriorityQueue = require("./priorityQueue");

function dijkstra(graph, startNode, endNode) {
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue.PriorityQueue(); // You need to implement a Priority Queue

    // Initialization
    for (let node in graph) {
        distances[node] = Infinity;
        prev[node] = null;
    }
    distances[startNode] = 0;
    pq.enqueue(startNode, 0);

    while (!pq.isEmpty()) {
        let minNode = pq.dequeue();
        let currNode = minNode.element;

        if (currNode === endNode) {
            break;
        }

        for (let neighbor in graph[currNode]) {
            let alt = distances[currNode] + graph[currNode][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = currNode;
                pq.enqueue(neighbor, distances[neighbor]);
            }
        }
    }

    // Reconstruct path
    let path = [];
    for (let at = endNode; at !== null; at = prev[at]) {
        path.push(at);
    }
    path.reverse();

    if (path.length === 1 && path[0] === startNode) {
        // no path exists
        return [];
    }
    return path;
}

module.exports = {
    dijkstra,
}