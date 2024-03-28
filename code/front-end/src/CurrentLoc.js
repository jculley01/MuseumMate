import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const images = {
  '1.1': require('./img/map1-1.png'),
  '1.2': require('./img/map1-2.png'),
  '2.1': require('./img/map2-1.png'),
  '2.2': require('./img/map2-2.png'),
  '3.1': require('./img/map3-1.png'),
  '3.2': require('./img/map3-2.png'),
};

function CurrentLoc({navigation, route }) {
  const { scannedValue } = route.params;
  const [imageNumber, setImageNumber] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});
  const serverIP='128.197.53.112'


  const fetchData = async () => {
    try {
      const response = await fetch(`http://${serverIP}:3000/location/${scannedValue}`);
      const data = await response.json();
      console.log(data);
      setImageNumber(data.location); // Assuming the response is the image number
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [scannedValue]);

  const handleRefresh = () => {
    fetchData();
  };

  const selectRoom = roomNumber => {
    setSelectedRooms(prevRooms => ({
      ...prevRooms,
      [roomNumber]: !prevRooms[roomNumber], // Toggle the selection state
    }));
  };

  const sendSelectedRooms = async () => {
    try {
        const selectedRoomsArray = Object.keys(selectedRooms).filter(room => selectedRooms[room]);
        const userID = scannedValue; // Assuming scannedValue is the userID. Replace as needed.
        console.log('Sending rooms:', selectedRoomsArray);

        const response = await fetch(`http://${serverIP}:3000/tsp-path`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID, nodes: selectedRoomsArray }),
        });

        // Handle the response here
        const responseData = await response.json();
        console.log('Server response:', responseData);
        navigation.navigate('RFIDScreen', { userID: scannedValue, pathData: responseData.path });
    } catch (error) {
        console.error('Error sending data:', error);
    }
    
};


  return (
    <View style={styles.container}>
      {imageNumber && images[imageNumber]
        ? <Image source={images[imageNumber]} style={styles.logo} />
        : <Text>Loading or no image available...</Text>
      }
      <View style={styles.roomButtonsContainer}>
        {['1.1', '1.2', '2.1', '2.2', '3.1', '3.2'].map(room => (
          <TouchableOpacity
            key={room}
            style={selectedRooms[room] ? styles.selectedRoomButton : styles.roomButton}
            onPress={() => selectRoom(room)}
          >
            <Text style={styles.buttonText}>{room}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={sendSelectedRooms}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
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
    width: Dimensions.get('window').width/1.5,
    height: Dimensions.get('window').height/2,
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
    backgroundColor: '#4CAF50', // Different color for selected rooms
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  refreshButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CurrentLoc;
