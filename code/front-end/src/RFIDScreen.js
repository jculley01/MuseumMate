import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

const RFIDScreen = ({ route }) => {
    const [rfidData, setRFIDData] = useState(null);
    const [objectData, setObjectData] = useState([]);
    const [hasPermission, setHasPermission] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [path, setPath] = useState(null);
    const [ratings, setRatings] = useState({}); // This will hold the ratings for each RFID item

    const setRating = (RFID, rating) => {
        setRatings(currentRatings => ({ ...currentRatings, [RFID]: rating }));
    };

    // Rating component
const Rating = ({ RFID, currentRating, onRating }) => {
    return (
        <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(index => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.ratingCircle,
                        { backgroundColor: currentRating >= index ? 'gold' : 'gray' }
                    ]}
                    onPress={() => onRating(RFID, index)}
                />
            ))}
        </View>
    );
};

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        if (route.params?.pathData) {
            setPath(route.params.pathData);
        }

        // Initialize WebSocket connection
        const ws = new WebSocket('ws://10.239.5.44:8080');
        ws.onopen = () => console.log('WebSocket connection established');
        ws.onmessage = (e) => {
            const message = JSON.parse(e.data);
            setRFIDData(message);
            fetchObjectData(message.RFID);
        };
        ws.onclose = () => console.log('WebSocket connection closed');
        return () => ws.close();
    }, [route.params?.pathData]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchCurrentLocation(); // Replace with your current location fetching logic
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchCurrentLocation = async () => {
        // Dummy userID for testing
        const userID = '4';
        try {
            const response = await fetch(`http://10.239.5.44:3000/location/${userID}`);
            const data = await response.json();
            console.log(data)
            setCurrentLocation(data.location);
        } catch (error) {
            console.error('Error fetching current location:', error);
        }
    };

    const getNextStep = () => {
        if (!currentLocation || !path) return null;
        const currentIndex = path.findIndex(step => step === currentLocation);
        return path[currentIndex + 1];
    };

    const removeImage = (name) => {
        setObjectData(currentData => currentData.filter(item => item.name !== name));
    };

    const fetchObjectData = async (RFID) => {
        try {
            RFID=RFID.trim()
            const response = await fetch(`http://10.192.18.75:3000/rfid/${RFID}`);
    
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                console.error('Server responded with an error:', response.status, response.statusText);
                return;
            }
    
            // Assuming the response should be JSON
            const data = await response.json();
            setObjectData(data);
        } catch (error) {
            console.error('Error fetching object data:', error);
        }
    };
    

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={Camera.Constants.Type.back}>
                {/* Display the next step */}
                <View style={styles.nextStepContainer}>
                    <Text style={styles.nextStepText}>Next Step: {getNextStep()}</Text>
                </View>

               {/* Overlay content */}
                    {objectData.map((item, index) => (
                        <View key={index} style={styles.mediaContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => removeImage(item.name)}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            <Image source={{ uri: item.url }} style={styles.media} />
                            {/* Rating Component */}
                            <Rating
                                RFID={item.RFID} // Ensure you have RFID in your item data
                                currentRating={ratings[item.RFID] || 0}
                                onRating={setRating}
                            />
                        </View>
                    ))}
            </Camera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    nextStepContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    nextStepText: {
        fontSize: 16,
        color: 'black',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
        marginLeft: Dimensions.get('window').width * 0.1,
        marginTop:Dimensions.get('window').height * 0.1,
        width: Dimensions.get('window').width * 0.8,
        alignItems: 'center',
    },
    media: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.6,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 16,
        color: 'black',
    },
    pathContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    pathText: {
        fontSize: 16,
        color: 'black',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    ratingCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 5,
    },
});

export default RFIDScreen;
