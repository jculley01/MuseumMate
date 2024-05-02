import React, { useState, useEffect, useRef } from 'react';
import {ScrollView, View, Text, Image, StyleSheet, Dimensions, TouchableOpacity,Modal,ActivityIndicator, Platform } from 'react-native';
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
import ViewPager from 'react-native-pager-view';
import { Video, ResizeMode } from 'expo-av';
import { PageIndicator } from 'react-native-page-indicator';
import { useIsFocused } from '@react-navigation/native';





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
    const promptLabels = ["Elementary", "College", "Professional"];
    const serverIP='128.197.53.112'
    const [pageIndex, setPageIndex] = useState(0);
    const isSpeaking = Speech.isSpeakingAsync();
    const [isRatingVisible, setIsRatingVisible] = useState(false);
    const [wsMessage, setWsMessage] = useState('');
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [exhibitName, setExhibitName] = useState("Dinosaur Fossils"); // Example
    const [rating, setRating] = useState(0); // Initialize rating state
    const [showHelpModal, setShowHelpModal] = useState(true); // initially true to show on first load
    const [connectionStatus, setConnectionStatus] = useState(null);
    const isFocused = useIsFocused();
    const currentRatingRef = useRef(0);
    const video = React.useRef(null);
    const [key, setKey] = useState(0);
    const wsRef = useRef(null);


    const [isPlaying, setIsPlaying] = useState(false);

    const restartCamera = () => {
        setKey(prevKey => prevKey + 1);
      };

    const handlePlayPause = () => {
      if (isPlaying) {
        video.current.pauseAsync();
      } else {
        video.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    };

    
    useEffect(() => {
        // Stop speech when navigating away from the screen or when the screen is not focused
        if (!isFocused) {
            Speech.stop();
        }
    }, [isFocused]);


    useEffect(() => {
        const interval = setInterval(() => {
            checkConnectionStatus();
        }, 30000); // Polls every 30 seconds

        // Initial check on component mount
        checkConnectionStatus();

        return () => clearInterval(interval);
    }, []);

    const checkConnectionStatus = async () => {
        try {
            const formattedUserID = userID.toString().padStart(4, '0');
            const response = await axios.get(`http://${serverIP}:3000/api/connection-status/${formattedUserID}`);
            setConnectionStatus(response.data.status === 1 ? 'connected' : 'notConnected');
        } catch (error) {
            console.error('Failed to fetch connection status:', error);
            setConnectionStatus('error');
        }
    };

    const getStatusIndicator = () => {
        switch (connectionStatus) {
            case 'connected':
                return <View style={[styles.statusIndicator, { backgroundColor: 'green' }]} />;
            case 'notConnected':
                return <View style={[styles.statusIndicator, { backgroundColor: 'red' }]} />;
            case 'error':
                return <View style={[styles.statusIndicator, { backgroundColor: 'grey' }]} />;
            default:
                return <ActivityIndicator size="small" color="#0000ff" />;
        }
    };


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
    // Function to initialize WebSocket
    const initializeWebSocket = () => {
        const wsUrl = `ws://${serverIP}:6060`;
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        wsRef.current.onmessage = (e) => {
            const message = JSON.parse(e.data);
            setWsMessage(message.message);
            setIsNotificationVisible(true); // Show the notification container
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };

    // Check if screen is focused and WebSocket is not already connected
    if (isFocused && (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED)) {
        initializeWebSocket();
    }

    // Cleanup function to close WebSocket when the component unmounts or loses focus
    return () => {
        if (wsRef.current) {
            wsRef.current.close();
        }
    };
}, [isFocused]);




useEffect(() => {
    (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    })();

    // Define a function to initialize the WebSocket
    const initializeWebSocket = () => {
        const wsUrl = `ws://${serverIP}:8080`;
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        wsRef.current.onmessage = (e) => {
            const message = JSON.parse(e.data);
            console.log('rfidws' + message.userID)
            const formattedUserID = userID.toString().padStart(4, '0');
            if (message.userID === formattedUserID) {
                setRFIDData(message);
                fetchObjectData(message.RFID);
            }
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };

    // Initialize or reinitialize WebSocket based on focus
    if (isFocused) {
        initializeWebSocket();
    }

    // Cleanup function to close WebSocket when component unmounts or loses focus
    return () => {
        if (wsRef.current) {
            wsRef.current.close();
        }
    };
}, [isFocused, route.params?.pathData])


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
        if (!currentLocation || !path || path.length === 0) return null; // No path data or current location data
        const currentIndex = path.findIndex(step => step === currentLocation);
        if (currentIndex === -1) return null; // Current location is not on the path
    
        // If currentIndex points to the last item in the path array, the tour is finished
        if (currentIndex === path.length - 1) {
            return "Tour Finished";
        }
    
        return path[currentIndex + 1] || "Tour Finished"; // Safe check in case of undefined next step
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
        Speech.stop()
    };

    const translateText = async (text, targetLanguage) => {
        const endpoint = "https://translation.googleapis.com/language/translate/v2";
        const params = {
            q: text,
            target: targetLanguage,
            key: 'AIzaSyCHBVX7b64isuOlTThIb0lfuSfrNRsrYEQ' // Your API key
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
        setIsLoadingApiResponse(true);  // Start loading
        try {
            const response = await fetch(`http://${serverIP}:3000/rfid/${RFID}`);
            if (!response.ok) {
                console.error('Server responded with an error:', response.status, response.statusText);
                setIsLoadingApiResponse(false);  // Stop loading on error
                return;
            }
    
            const data = await response.json();
            const fetchedData = {
                description: '',
                media: [],  // Array to hold both images and videos
                prompts: [],
                title: ''
            };
    
            // Process each item based on its type
            for (const item of data) {
                const contentResponse = await fetch(item.url);
                if (!contentResponse.ok) {
                    console.error(`Error fetching ${item.name}:`, contentResponse.status, contentResponse.statusText);
                    continue;
                }
    
                if (item.name.includes('desc')) {
                    fetchedData.description = await contentResponse.text();
                } else if (item.name.includes('img') || item.name.includes('vid')) {
                    fetchedData.media.push({
                        type: item.name.includes('img') ? 'image' : 'video',
                        url: item.url
                    });
                } else if (item.name.includes('prompt')) {
                    const promptsText = await contentResponse.text();
                    fetchedData.prompts = promptsText.split(',');
                } else if (item.name.includes('title')) {
                    fetchedData.title = await contentResponse.text();
                    setExhibitName(fetchedData.title)
                }
            }
            setObjectData([{
                name: RFID,
                media: fetchedData.media,
                description: fetchedData.description,
                prompts: fetchedData.prompts,
                title: fetchedData.title
            }]);
        } catch (error) {
            console.error('Error fetching object data:', error);
        } finally {
            setIsLoadingApiResponse(false);  // Stop loading regardless of outcome
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
                rating: currentRatingRef.current
            };
            
            // Perform the POST request
            const response = await axios.post(`http://${serverIP}:3000/api/exhibit-rating`, payload);
            
            // Check response status
            if (response.status === 200) {
                //alert("Rating sent successfully!");
            } else {
                // Handle server response indicating a failure
                alert("Failed to send rating.");
            }
        } catch (error) {
            console.error("Error sending rating:", error);
            alert("Failed to send rating.");
        }
        toggleRatingVisibility();
    };
    
    const onPageSelected = (e) => {
        setPageIndex(e.nativeEvent.position);
    };
    

    return (
<View style={styles.container}>

    <Camera key={key} style={styles.camera} type={Camera.Constants.Type.back} >
    <Modal
    animationType="slide"
    transparent={true}
    visible={showHelpModal}
    onRequestClose={() => {
      setShowHelpModal(false);
      if (Platform.OS === 'android') {
        restartCamera(); // Restart camera only on Android
      }
    }}
  >

    <View style={styles.centeredView}>
        <View style={styles.startupView}>
            <Image
                style={styles.helpImage}
                source={require('./img/scan.jpg')} // Update with your image path
            />
            <Text style={styles.modalText}>
                Welcome to our interactive media display. To interact with the multimedia display tap your TourTag to the RFID tags placed on each table.
            </Text>
            <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setShowHelpModal(false);
            if (Platform.OS === 'android') {
              restartCamera(); // Ensure the camera is also restarted when explicitly closing the modal
            }
          }}
        >
                <Text style={styles.starttextStyle}>X Close</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>

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
                    <Text style={styles.nextStepText}>Status: {getStatusIndicator()}</Text>
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

                        {/* ViewPager for media */}
                        <ViewPager style={styles.viewPager} initialPage={0} onPageSelected={onPageSelected} >
                            {item.media.map((media, mediaIndex) => (
                                <View key={mediaIndex} style={styles.pageStyle}>
                                    {media.type === 'video' ? (
                                        <>
                                            <Video
                                                ref={video}
                                                style={styles.media}
                                                source={{ uri: media.url }}
                                                useNativeControls
                                                resizeMode="contain"
                                                isLooping
                                            />
                                            <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
                                                    {isPlaying ? (
                                                        <Feather name="pause" size={24} color="white" />
                                                    ) : (
                                                        <Feather name="play" size={24} color="white" />
                                                    )}
                                                </TouchableOpacity>
                                        </>
                                    ) : (
                                        <Image
                                            source={{ uri: media.url }}
                                            style={styles.media}
                                        />
                                    )}
                                </View>
                            ))}
                        </ViewPager>
                        <View style={styles.pageIndicator}>
                            <PageIndicator count={item.media.length} current={pageIndex} />
                        </View>
          
                

                        {/* Static content below the ViewPager */}
                        {isApiResponseVisible ? ( 
                        <View>
                            <ScrollView style={{ maxHeight: Dimensions.get('window').height * 0.3,marginVertical: 10  }}>
                                <Text style={styles.apiResponseText}>{apiResponse}</Text>
                            </ScrollView>
                           
                        <TouchableOpacity style={styles.apiResponseCloseButton} onPress={() => setIsApiResponseVisible(false)}>
                             <Text style={styles.closeButtonText}>X</Text>
                         </TouchableOpacity>
                         </View>
                        ) : (
                            <ScrollView style={{ maxHeight: Dimensions.get('window').height * 0.3, marginVertical: 10 }}>
                                <Text style={styles.descriptionText}>{translatedText || item.description}</Text>
                            </ScrollView>
                        )}

                    {isRatingVisible ? (
                                        <View style={styles.ratingContainer}>
                            <Rating
                                showRating
                                onFinishRating={(rating) => {
                                    setRating(rating);
                                    currentRatingRef.current = rating;
                                }}
                                style={{ paddingVertical: 1 }}
                                imageSize={30}
                                startingValue={rating}
                                fractions={1}
                            />
                            <View style={styles.ratingButtonsContainer}>
                                <TouchableOpacity
                                    onPress={sendRating}
                                    style={styles.sendButton}
                                >
                                    <Feather name="send" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setIsRatingVisible(false)} // Toggle rating visibility off
                                    style={styles.sendButton}
                                >
                                    <AntDesign name="close" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ): (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity style={styles.translateButton} onPress={() => setIsPickerVisible(true)}>
                            <MaterialIcons name="translate" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.speakButton} onPress={() => toggleSpeak(item.description, selectedLanguage)}>
                            <AntDesign name="sound" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.apiButton} onPress={() => setIsPromptPickerVisible(true)}>
                            <Entypo name="info" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsRatingVisible(!isRatingVisible)} style={styles.apiButton}>
                            <Entypo name="star-outlined" size={24} color="white" />
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
        marginBottom: Dimensions.get('window').height * 0.1,
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
    viewPager: {
          // Takes up the full space of its parent container
         width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').width * 0.6,
    },
    pageStyle: {
        alignItems: 'center',  // Centers content horizontally
        justifyContent: 'center',  // Centers content vertically
        padding: 10,  // Provides padding inside each page of the ViewPager
    },
    pageIndicator: {
        position: 'relative',
        top:3,
        alignSelf: 'center'
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
        backgroundColor: '#dfdfdf',
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
        textAlign: "center",
        fontSize: 18,

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
    ratingButtonsContainer: {
        flexDirection: 'row',
        width: '20%', // Ensure it takes full width of the container
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    startupView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    starttextStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
    helpImage: {
        width: 200, // Adjust based on your image and preference
        height: 100, // Adjust based on your image and preference
        marginBottom: 15,
    },
    statusIndicator: {
        width: 15,
        height: 15,
        borderRadius: 9.5,
    },
    controlButton:{
        backgroundColor: '#7574da', // Example button color, adjust as needed
        marginTop: -40, // Spacing between the rating component and the Send button
        paddingHorizontal: 8, // Horizontal padding
        paddingVertical: 8, // Vertical padding
        borderRadius: 5, // Rounded corners
    }
    
    
});

export default RFIDScreen;

