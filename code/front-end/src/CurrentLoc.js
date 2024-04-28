import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const images = {
  '1': require('./img/map1.png'),
  '2': require('./img/map2.png'),
  '3': require('./img/map3.png'),
  '4': require('./img/map4.png'),
  '5': require('./img/map5.png'),
  '6': require('./img/allmap.png')
};

function CurrentLoc({ navigation, route }) {
  const { scannedValue } = route.params;
  const [imageNumber, setImageNumber] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [canSend, setCanSend] = useState(true);
  const [viewsend, setviewsend] = useState(true); // State to control the visibility of the send button
  const serverIP = '128.197.53.112';

  const fetchData = async () => {
    try {
      const response = await fetch(`http://${serverIP}:3000/location/${scannedValue}`);
      const data = await response.json();
      setImageNumber(data.location);
      setviewsend(data.location !== 'User is not in any room'); // Update button visibility based on location
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [scannedValue]);

  const selectRoom = roomNumber => {
    setSelectedRooms(prevRooms => ({
      ...prevRooms,
      [roomNumber]: !prevRooms[roomNumber]
    }));
  };

  const sendSelectedRooms = async () => {
    if (canSend && viewsend) { // Ensure button is visible and enabled before allowing send
      setCanSend(false); // Disable button after it's pressed
      setTimeout(() => setCanSend(true), 3000);
      try {
        const selectedRoomsArray = Object.keys(selectedRooms).filter(room => selectedRooms[room]);
        const userID = scannedValue;
        const response = await fetch(`http://${serverIP}:3000/tsp-path`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID, nodes: selectedRoomsArray }),
        });
        const responseData = await response.json();
        navigation.navigate('RFIDScreen', { userID: scannedValue, pathData: responseData.path });
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={images[imageNumber] || images['6']} style={styles.logo} />
      <View style={styles.roomButtonsContainer}>
        {['1', '2', '3', '4', '5'].map(room => (
          <TouchableOpacity
            key={room}
            style={selectedRooms[room] ? styles.selectedRoomButton : styles.roomButton}
            onPress={() => selectRoom(room)}
          >
            <Text style={styles.buttonText}>{room}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {viewsend ? (
        <TouchableOpacity style={styles.sendButton} onPress={sendSelectedRooms}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.errorButton}>
          <Text style={styles.buttonText}>Location Inaccurate: Please move around to refresh location</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7574DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 2,
    resizeMode: 'contain',
  },
  roomButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  roomButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  selectedRoomButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: Dimensions.get('window').height / 9,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 20,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5%',
  },
});

export default CurrentLoc;
