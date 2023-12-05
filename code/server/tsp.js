function getPermutations(array) {
    if (array.length === 0) return [[]];

    const firstElement = array[0];
    const rest = array.slice(1);

    const permsWithoutFirst = getPermutations(rest);
    const allPermutations = [];

    permsWithoutFirst.forEach(perm => {
        for (let i = 0; i <= perm.length; i++) {
            const permWithFirst = [...perm.slice(0, i), firstElement, ...perm.slice(i)];
            allPermutations.push(permWithFirst);
        }
    });

    return allPermutations;
}

function dijkstra(graph, start, end) {
    const distances = {};
    const parents = {};
    const visited = new Set();
    Object.keys(graph).forEach(node => distances[node] = Infinity);
    distances[start] = 0;

    let currentNode = start;
    while (currentNode) {
        visited.add(currentNode);
        const neighbors = graph[currentNode];
        for (const neighbor in neighbors) {
            if (!visited.has(neighbor)) {
                const newDistance = distances[currentNode] + neighbors[neighbor];
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    parents[neighbor] = currentNode;
                }
            }
        }

        currentNode = null;
        let smallestDistance = Infinity;
        for (const node in distances) {
            if (!visited.has(node) && distances[node] < smallestDistance) {
                smallestDistance = distances[node];
                currentNode = node;
            }
        }
    }

    // Reconstruct path
    const path = [];
    let current = end;
    while (current !== start) {
        path.unshift(current);
        current = parents[current];
    }
    path.unshift(start);

    return { distance: distances[end], path };
}

function calculatePathForPermutation(graph, start, permutation) {
    let totalDistance = 0;
    let current = start;
    let fullPath = [];

    for (const node of permutation) {
        const result = dijkstra(graph, current, node);
        if (result.distance === Infinity) return { distance: Infinity, path: [] };
        totalDistance += result.distance;
        fullPath = fullPath.concat(result.path.slice(1));
        current = node;
    }

    return { distance: totalDistance, path: [start, ...fullPath] };
}

function findShortestRoute(graph, start, nodesToVisit) {
    const permutations = getPermutations(nodesToVisit);
    let shortestDistance = Infinity;
    let shortestPath = [];

    permutations.forEach(permutation => {
        const { distance, path } = calculatePathForPermutation(graph, start, permutation);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            shortestPath = path;
        }
    });

    return { shortestDistance, shortestPath };
}


module.exports = {
    findShortestRoute,
}