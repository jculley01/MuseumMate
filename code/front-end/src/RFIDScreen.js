import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity,Modal,ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech'; // Import expo-speech
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';



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
    const promptLabels = ["Artist", "Style", "Time Period"];


   // Text-to-Speech function
   const speak = (text, languageCode) => {
    const speechLanguage = convertToSpeechLanguageCode(languageCode);
    Speech.stop(); // Stop any previous speech

    // Determine the content to speak: use API response if visible, else use the item description or translated text
    const contentToSpeak = isApiResponseVisible ? apiResponse : (translatedText || text);

    Speech.speak(contentToSpeak, {
        language: speechLanguage,
    });
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



    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        if (route.params?.pathData) {
            setPath(route.params.pathData);
        }
        //fetchObjectData();
        const ws = new WebSocket('ws://10.192.45.20:8080');
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
            const response = await fetch(`http://10.192.45.20:3000/location/${userID}`);
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
        const golangAPIEndpoint = "http:/10.192.39.193:4040/chat"; // Replace with your GoLang API URL
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
            const response = await fetch(`http://10.192.45.20:3000/rfid/museummate0001`);
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

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={Camera.Constants.Type.back}>
                {/* Display the next step */}
                <View style={styles.nextStepContainer}>
                    <Text style={styles.nextStepText}>Next Step: {getNextStep()}</Text>
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
                                onPress={() => speak(item.description, selectedLanguage)}
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

                    </View>
                </View>
                ))}
            </Camera>
    
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
    
    
});

export default RFIDScreen;
