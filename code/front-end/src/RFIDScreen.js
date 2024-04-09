import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity,Modal,ActivityIndicator } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech'; // Import expo-speech
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { Feather } from '@expo/vector-icons';



const images = {
    '1': require('./img/map1.png'),
    '2': require('./img/map2.png'),
    '3': require('./img/map3.png'),
    '4': require('./img/map4.png'),
    '5': require('./img/map5.png'),
    'default':require('./img/allmap.png'),
  };

const transitionImages={
    '1-2': require('./img/9map1-2.png'),
    '1-3': require('./img/9map1-3.png'),
    '1-4': require('./img/9map1-4.png'),
    '1-5': require('./img/9map1-5.png'),

    '2-1': require('./img/9map2-1.png'),
    '2-3': require('./img/9map2-3.png'),
    '2-4': require('./img/9map2-4.png'),
    '2-5': require('./img/9map2-5.png'),

    '3-1': require('./img/9map3-1.png'),
    '3-2': require('./img/9map3-2.png'),
    '3-4': require('./img/9map3-4.png'),
    '3-5': require('./img/9map3-5.png'),

    '4-1': require('./img/9map4-1.png'),
    '4-2': require('./img/9map4-2.png'),
    '4-3': require('./img/9map4-3.png'),
    '4-5': require('./img/9map4-5.png'),

    '5-1': require('./img/9map5-1.png'),
    '5-2': require('./img/9map5-2.png'),
    '5-3': require('./img/9map5-3.png'),
    '5-4': require('./img/9map5-4.png'),
}
  


const RFIDScreen = ({ route }) => {
    const [rfidData, setRFIDData] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoadingApiResponse, setIsLoadingApiResponse] = useState(false);
    const userID = route.params?.userID;

    const [objectData, setObjectData] = useState([]);
    const [hasPermission, setHasPermission] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [path, setPath] = useState(null);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [isApiResponseVisible, setIsApiResponseVisible] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [isPromptPickerVisible, setIsPromptPickerVisible] = useState(false);
    const promptLabels = ["Artist", "Style", "Visit Stats"];
    const serverIP='128.197.53.112'
    const myIP='10.239.71.233'
    const isSpeaking = Speech.isSpeakingAsync();
    const [isRatingVisible, setIsRatingVisible] = useState(false);
    const [wsMessage, setWsMessage] = useState('');
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [exhibitName, setExhibitName] = useState("Dinosaur Fossils"); // Example
    const [rating, setRating] = useState(0); // Initialize rating state





    const toggleSpeak = async (text, languageCode) => {
        const speaking = await Speech.isSpeakingAsync();
        if (speaking) {
            Speech.stop(); // If speech is active, stop it
        } else {
            // If not speaking, start speaking the given text
            const speechLanguage = convertToSpeechLanguageCode(languageCode);
            const contentToSpeak = isApiResponseVisible ? apiResponse : (translatedText || text);
            Speech.speak(contentToSpeak, { language: speechLanguage });
        }
    };

// Function to convert Google Translate API language codes to Expo Speech format
const convertToSpeechLanguageCode = (languageCode) => {
    const codeMap = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'it': 'it-IT',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'pt': 'pt-BR',
        'ru': 'ru-RU',
        'zh': 'zh-CN',
    };
    return codeMap[languageCode] || 'en-US'; // Default to 'en-US' if no mapping found
};




//Notifcation endpoint:
useEffect(() => {
    const wsUrl = `ws://${serverIP}:6060`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
        console.log('WebSocket connection Message established');
    };
    ws.onmessage = (e) => {
        const message = JSON.parse(e.data);
        //console.log('Received message:', message);
        setWsMessage(message.message);
        setIsNotificationVisible(true); // Show the notification container
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
    return () => {
        ws.close();
    };
}, []); 




    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        if (route.params?.pathData) {
            setPath(route.params.pathData);
        }
        //fetchObjectData();
        const ws = new WebSocket(`ws://${serverIP}:8080`);
        ws.onopen = () => console.log('WebSocket connection established');
        ws.onmessage = (e) => {
            const message = JSON.parse(e.data);
            console.log('rfidws'+message)
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
        if (!userID) return; // Check if userID is available
        try {
            const response = await fetch(`http://${serverIP}:3000/location/${userID}`);
            const data = await response.json();
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

    //Calculate the image to display
    const currentLocationImage = images[currentLocation] || images['default'];
    const nextStep = getNextStep();
    let imageUrl;

    if (currentLocation && nextStep) {
        const transitionKey = `${currentLocation}-${nextStep}`;
        imageUrl = transitionImages[transitionKey]
            ? Image.resolveAssetSource(transitionImages[transitionKey]).uri
            : Image.resolveAssetSource(currentLocationImage).uri; // Fallback to the current location image if no specific transition image is found
    } else {
        imageUrl = Image.resolveAssetSource(currentLocationImage).uri;
    }


    
    const removeImage = (name) => {
        setObjectData(currentData => currentData.filter(item => item.name !== name));
    };

    const translateText = async (text, targetLanguage) => {
        const endpoint = "https://translation.googleapis.com/language/translate/v2";
        const params = {
            q: text,
            target: targetLanguage,
            key: 'AIzaSyAnRjG1IiAcL2QzVTBDQK9XsbqmHY2-xXU' // Your API key
        };
    
        try {
            const response = await axios.post(endpoint, {}, {
                params: params
            });
            return response.data.data.translations[0].translatedText;
        } catch (error) {
            console.error('Error during translation:', error);
            return text; // Return the original text if translation fails
        }
    };

    const sendPromptToGolangAPI = async (prompt) => {
        const golangAPIEndpoint = `http:/${serverIP}:4040/chat`; // Replace with your GoLang API URL
        setIsLoadingApiResponse(true); // Start loading
        try {
            const response = await axios.post(golangAPIEndpoint, { prompt: prompt });
            const apiResponseText = response.data.response; // Assuming the response has a 'response' field
    
            // Translate the API response to the selected language
            const translatedApiResponse = await translateText(apiResponseText, selectedLanguage);
            setApiResponse(translatedApiResponse);
            setIsApiResponseVisible(true); // Show the API response
        } catch (error) {
            console.error('Error sending prompt to GoLang API:', error);
        }
        setIsLoadingApiResponse(false); // End loading
    };
    
    useEffect(() => {
        // Function to update the API response when the selected language changes
        const updateApiResponseLanguage = async () => {
            if (apiResponse && isApiResponseVisible) {
                const translatedApiResponse = await translateText(apiResponse, selectedLanguage);
                setApiResponse(translatedApiResponse);
            }
        };
    
        updateApiResponseLanguage();
    }, [selectedLanguage]);
    
    

    const fetchObjectData = async (RFID) => {
        try {
            const response = await fetch(`http://${serverIP}:3000/rfid/${RFID}`);
           // console.log('rfid response:', response);
    
            if (!response.ok) {
                console.error('Server responded with an error:', response.status, response.statusText);
                return;
            }
    
            const data = await response.json();
    
            // Initialize an object to hold the fetched contents
            const fetchedData = {
                description: '',
                img: '',
                prompts: []
            };
    
            // Fetch each URL based on the type of content it holds
            for (const item of data) {
                const contentResponse = await fetch(item.url);
                if (!contentResponse.ok) {
                    console.error(`Error fetching ${item.name}:`, contentResponse.status, contentResponse.statusText);
                    continue; // Skip this item if there's an error
                }
                if (item.name.includes('desc')) {
                    fetchedData.description = await contentResponse.text();
                } else if (item.name.includes('img')) {
                    // Assuming the image URL is directly usable
                    fetchedData.img = item.url;
                } else if (item.name.includes('prompt')) {
                    const promptsText = await contentResponse.text();
                    fetchedData.prompts = promptsText.split(','); // Assuming each prompt is on a new line
                }
            }
    
            setObjectData([{
                name: `Object museummate0001`, // You might want to adjust this based on your actual data structure
                url: fetchedData.img,
                description: fetchedData.description,
                prompts: fetchedData.prompts,
            }]);

            
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


    const toggleRatingVisibility = () => {
        setIsRatingVisible(!isRatingVisible);
    };

    const handleFinishRating = (ratingValue) => {
        setRating(ratingValue); // Set the new rating
    };
    

    const sendRating = async () => {
        try {
            // Construct the payload
            const payload = {
                exhibit: exhibitName,
                rating: rating
            };
            
            // Perform the POST request
            const response = await axios.post(`http://${serverIP}/api/exhibit-rating`, payload);
            
            // Check response status
            if (response.status === 200) {
                alert("Rating sent successfully!");
            } else {
                // Handle server response indicating a failure
                alert("Failed to send rating.");
            }
        } catch (error) {
            console.error("Error sending rating:", error);
            alert("Failed to send rating.");
        }
    };
    
    

    return (
<View style={styles.container}>
    <Camera style={styles.camera} type={Camera.Constants.Type.back}>
        {isNotificationVisible && (
            <View style={styles.notificationContainer}>
                <Text style={styles.notificationText}>{'Admin Message:'+wsMessage}</Text>
                <TouchableOpacity 
                    style={styles.notificationCloseButtonNoti} 
                    onPress={() => setIsNotificationVisible(false)}
                >
                    <Text style={styles.closeButtonTextNoti}>X</Text>
                </TouchableOpacity>
            </View>
        )}
                {/* Display the next step */}
                <View style={styles.nextStepContainer}>
                     <TouchableOpacity onPress={() => setIsMapVisible(true)} >
                        <Text style={styles.nextStepText}>Next Step: {getNextStep()}</Text>
                    </TouchableOpacity>
                </View>
    
                {isLoadingApiResponse && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}


                {/* Overlay content */}
                {objectData.map((item, index) => (
                    <View key={index} style={styles.mediaContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => removeImage(item.name)}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: item.url }} style={styles.media} />
                        
                        {/* Conditionally render the API response or the item's description */}
                        {isApiResponseVisible ? (
                            <View style={styles.apiResponseContainer}>
                                <Text style={styles.apiResponseText}>{apiResponse}</Text>
                                <TouchableOpacity style={styles.apiResponseCloseButton} onPress={() => setIsApiResponseVisible(false)}>
                                    <Text style={styles.closeButtonText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.descriptionText}>
                                {translatedText || item.description}
                            </Text>
                        )}
                    <View style={styles.actionContainer}>
                       
                        {/* Translate button */}
                        <TouchableOpacity
                            style={styles.translateButton}
                            onPress={() => {
                                setIsPickerVisible(true);
                            }}
                        >
                            <MaterialIcons name="translate" size={24} color="white" />
                        </TouchableOpacity>

                        {/* Speak button */}
                        <TouchableOpacity
                            style={styles.speakButton}
                            onPress={() => toggleSpeak(item.description, selectedLanguage)}
                        >
                                <AntDesign name="sound" size={24} color="white" />
                            </TouchableOpacity>


                         {/* GoLang API button */}
                         <TouchableOpacity
                            style={styles.apiButton}
                            onPress={() => {
                                setIsPromptPickerVisible(true);
                            }}
                        >
                            <Entypo name="info" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                                    onPress={() => setIsRatingVisible(!isRatingVisible)} // Toggle the visibility of the rating component
                                    style={styles.apiButton}
                                >
                                    <Entypo name="star-outlined" size={24} color="white" />
                         </TouchableOpacity>
                    </View>
                    {isRatingVisible && (
                            <View style={styles.ratingContainer}>
                                <Rating
                                    showRating
                                    onFinishRating={(rating) => console.log('Rated with: ', rating)} // Temporarily log the rating, adjust as needed
                                    style={{ paddingVertical: 10 }}
                                    imageSize={30}
                                    startingValue={0}
                                    fractions={1}
                                />
                                <TouchableOpacity
                                    onPress={sendRating} // Call sendRating when the button is pressed
                                    style={styles.sendButton}
                                >
                                    <Feather name="send" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        )}
                </View>
                ))}
            </Camera>
            {/* Map Zoom and Overlay */}
            <Modal visible={isMapVisible} transparent={true} onRequestClose={() => setIsMapVisible(false)}>
                        <ImageViewer
                            imageUrls={[{ url: imageUrl }]}
                            onSwipeDown={() => setIsMapVisible(false)}
                            enableSwipeDown={true}
                            renderIndicator={() => null} // If you want to remove the page indicator
                        />
                        <Text style={styles.swipeDownText}>Swipe down to exit</Text>
            </Modal>

    
            {/* Language Picker Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPickerVisible}
                onRequestClose={() => {
                    setIsPickerVisible(!isPickerVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Picker
                            selectedValue={selectedLanguage}
                            style={{ width: 150, height: 200 }} // Adjust the size as needed
                            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                        >
                            <Picker.Item label="English" value="en" />
                            <Picker.Item label="Spanish" value="es" />
                            <Picker.Item label="French" value="fr" />
                            <Picker.Item label="German" value="de" />
                            <Picker.Item label="Italian" value="it" />
                            <Picker.Item label="Japanese" value="ja" />
                            <Picker.Item label="Korean" value="ko" />
                            <Picker.Item label="Portuguese" value="pt" />
                            <Picker.Item label="Russian" value="ru" />
                            <Picker.Item label="Chinese" value="zh" />
                        </Picker>
                    </View>
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={async () => {
                            setIsPickerVisible(!isPickerVisible);
                            if (isApiResponseVisible && apiResponse) {
                                const translatedApiResponse = await translateText(apiResponse, selectedLanguage);
                                setApiResponse(translatedApiResponse);
                            } else {
                                const translatedText = await translateText(objectData[0].description, selectedLanguage);
                                setTranslatedText(translatedText);
                            }
                        }}
                    >
                        <Text style={styles.textStyle}>Done</Text>
                    </TouchableOpacity>

                </View>
            </Modal>

            {/* Prompt Picker Modal */}
                        
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPromptPickerVisible}
                onRequestClose={() => {
                    setIsPromptPickerVisible(!isPromptPickerVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <Text>Learn more</Text>
                    <View style={styles.modalView}>
                        <Picker
                            selectedValue={selectedPrompt}
                            style={{ width: 200, height: 200 }}
                            onValueChange={(itemValue) => setSelectedPrompt(itemValue)}
                        >
                            {objectData.length > 0 && objectData[0].prompts.map((prompt, index) => (
                                <Picker.Item key={index} label={promptLabels[index]} value={prompt} />
                            ))}

                        </Picker>
                    </View>
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => {
                            setIsPromptPickerVisible(!isPromptPickerVisible);
                            sendPromptToGolangAPI(selectedPrompt);
                        }}
                    >
                        <Text style={styles.textStyle}>Done</Text>
                    </TouchableOpacity>
                </View>
            </Modal>



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
    descriptionText: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
        marginTop: 5, 
        marginBottom: 5,
    },
    speakButton: {
        backgroundColor: '#7574da', // Your button color
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5, // Add space between buttons
    },
    speakButtonText: {
        color: 'white', // Your button text color
        textAlign: 'center',
    },
    translateButton: {
        backgroundColor: '#7574da', // Your button color
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5, // Add space between buttons
    },
    translateButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    translatedText: {
        marginTop: 10,
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '50%', // Set width
        // Remove padding and margin to use the full container
    },
    doneButton: {
        backgroundColor: "#2196F3",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15, // Space between the picker and the button
        width: '50%', // Match the width with modalView
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    actionContainer: {
        flexDirection: 'row', // Arrange children in a row
        justifyContent: 'space-around', // Distribute children evenly
        alignItems: 'center', // Align children vertically
        marginTop: 10, // Add some space above the container
    },
    apiResponseContainer: {
        backgroundColor: '#f9f9f9', // Light background for the response container
        padding: 10,
        borderRadius: 10,
        margin: 5,
    },
    apiResponseText: {
        fontSize: 14,
        color: 'black',
    },
    apiResponseCloseButton: {
        position: 'absolute',
        top: -15,
        right: -5,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5,
        zIndex: 1,
    },
    apiButton: {
        backgroundColor: '#7574da', // Choose a color for your button
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5, // Add space between buttons
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)', // Semi-transparent background
        zIndex: 1,
    },
    ratingContainer: {
        flexDirection: 'row', // Arrange Rating and Send button in a row
        alignItems: 'center', // Vertically center the items
        justifyContent: 'center', // Horizontally center the items
        marginTop: 10,
        // Adjust padding and margins as needed
    },
    sendButton: {
        backgroundColor: '#7574da', // Example button color, adjust as needed
        marginLeft: 10, // Spacing between the rating component and the Send button
        paddingHorizontal: 8, // Horizontal padding
        paddingVertical: 8, // Vertical padding
        borderRadius: 5, // Rounded corners
        // Additional button styling
    },
    sendButtonText: {
        color: 'white', // Text color
        // Additional text styling
    },
    notificationContainer: {
        position: 'absolute',
        top: 8,
        left: 150,
        right: 0,
        backgroundColor: '#7574da',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2, // Make sure it's above other content
    },
    notificationText: {
        fontSize: 16,
        color: 'white',
    },
    notificationCloseButton: {
        // Styles for your close button
        padding: 8,
        backgroundColor: 'black',
        borderRadius: 5,
    },
    swipeDownText: {
        color: '#FFF',
        fontSize: 16,
        bottom: '20%',
        left:'35%'
    },
    
    
    
    
});

export default RFIDScreen;
