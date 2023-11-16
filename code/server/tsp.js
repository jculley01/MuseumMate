function calculatePathWeight(path) {
    let weight = 0;
    console.log(path.length);
    for (let i = 0; i < path.length - 1; i++) {
        weight += graph[path[i]][path[i + 1]];
    }
    return weight;
}

function permute(permutation) {
    let length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    console.log(length);
    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

function tsp(graph, start, nodesToVisit) {
    let shortestPath = null;
    let minPathWeight = Number.MAX_SAFE_INTEGER;
    let paths = permute(nodesToVisit);

    paths.forEach(path => {
        let currentPath = [start, ...path, start];
        let currentWeight = calculatePathWeight(currentPath);
        if (currentWeight < minPathWeight) {
            minPathWeight = currentWeight;
            shortestPath = currentPath;
        }
    });

    return { shortestPath, minPathWeight };
}

module.exports = {
    tsp,
}