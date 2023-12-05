async function listAllObjects(bucketName, minioClient) {
    const stream = minioClient.listObjects(bucketName, '', true);
    const objects = [];

    for await (const obj of stream) {
        objects.push(obj);
    }

    return objects;
}


module.exports = {
    listAllObjects,
}