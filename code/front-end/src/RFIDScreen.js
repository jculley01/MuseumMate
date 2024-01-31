import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity,Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech'; // Import expo-speech
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';



const RFIDScreen = ({ route }) => {
    const [rfidData, setRFIDData] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [translatedText, setTranslatedText] = useState('');


    const [objectData, setObjectData] = useState([
        // Mock data
        { name: 'Object 1', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg', description:`The Mona Lisa is a world-renowned portrait painted by Leonardo da Vinci during the Renaissance. Measuring 77 cm by 53 cm, it depicts a woman,
        commonly believed to be Lisa Gherardini, with a serene and enigmatic expression. Her gaze directly meets the viewer's, creating an intimate interaction. The painting is celebrated for its exquisite detail, the subtle modeling of forms, 
        and the atmospheric illusionism. Da Vinci's use of sfumato technique masterfully blurs the lines and shadows, giving depth and realism. Set against a dreamy, vague landscape, the Mona Lisa's smile remains its most captivating and mysterious feature,
         making it an iconic masterpiece of art history.` },
        // ... add more objects as needed
    ]);
    const [hasPermission, setHasPermission] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [path, setPath] = useState(null);
    const [isPickerVisible, setIsPickerVisible] = useState(false);


   // Text-to-Speech function
// Text-to-Speech function
const speak = (text, languageCode) => {
    const speechLanguage = convertToSpeechLanguageCode(languageCode);
    Speech.stop(); // Stop any previous speech
    const contentToSpeak = translatedText || text; // Use translated text if available
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

        // WebSocket code commented out
        // const ws = new WebSocket('ws://10.239.5.44:8080');
        // ws.onopen = () => console.log('WebSocket connection established');
        // ws.onmessage = (e) => {
        //     const message = JSON.parse(e.data);
        //     setRFIDData(message);
        //     fetchObjectData(message.RFID);
        // };
        // ws.onclose = () => console.log('WebSocket connection closed');
        // return () => ws.close();
    }, [route.params?.pathData]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchCurrentLocation(); // Replace with your current location fetching logic
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchCurrentLocation = async () => {
        // Dummy userID for testing
        const userID = '1';
        try {
            const response = await fetch(`http://10.192.12.40:3000/location/${userID}`);
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

    const translateText = async (text, targetLanguage) => {
        const endpoint = "https://translation.googleapis.com/language/translate/v2";
        const params = {
            q: text,
            target: targetLanguage,
            key: 'AIzaSyCxPxqJJ4q1Fm-IzlPPp_Fd94Sspu_ikXk' // Your API key
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
    

    // fetchObjectData function can be removed if not used elsewhere

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
                    <Text style={styles.descriptionText}>
                        {translatedText || item.description}
                    </Text>
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
                        onPress={() => {
                            setIsPickerVisible(!isPickerVisible);
                            translateText(objectData[0].description, selectedLanguage).then(setTranslatedText);
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
});

export default RFIDScreen;
