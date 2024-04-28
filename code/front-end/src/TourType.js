import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

const serverIP = '128.197.53.112';

const TourType = ({ navigation, route }) => {
  const { scannedValue } = route.params;
  const userId = scannedValue; // This assumes that scannedValue is the user ID

  const [connectionStatus, setConnectionStatus] = useState(null);

  const formatUserId = (id) => {
    return id.toString().padStart(4, '0');
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get(`http://${serverIP}:3000/api/connection-status/${formatUserId(userId)}`);
      if (response.data.status === 1) {
        setConnectionStatus('success');
      } else if (response.data.status === 0) {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('API call failed:', error);
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const handleTimed = () => {
    if (scannedValue) {
      navigation.navigate('PreMade', { scannedValue });
    } else {
      alert('No scanned barcode data available');
    }
  };

  const handleEx = () => {
    navigation.navigate('RFIDScreen', {userID:scannedValue})
  };

  return (
    <View style={styles.container}>
      <Image source={require('./MuseumMate.png')} style={styles.logo} />
      {connectionStatus === 'success' ? (
        <>
          <Image source={require('./img/greencheck.png')} style={styles.imagessub}/>
          <Text style={styles.subTitle2}>Paired! All Set!</Text>
          <Text style={styles.subTitle}>Select a Tour Type</Text>
          <TouchableOpacity style={styles.button} onPress={handleTimed}>
            <Text style={styles.buttonText}>Start A Timed Tour</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleEx}>
            <Text style={styles.buttonText}>Start Exploring</Text>
          </TouchableOpacity>
        </>
      ) : connectionStatus === 'error' ? (
        <>
          <Image source={require('./img/redx.png')} style={styles.imagessub}/>
          <TouchableOpacity style={styles.errorButton} onPress={() => navigation.navigate('Scanner')}>
            <Text style={styles.buttonText}>Error Pairing: Click to Return</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7574DA',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    marginTop: '30%',
  },
  imagessub: {
    width: '50%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginTop: '5%',
  },
  subTitle: {
    color: 'white',
    fontSize: 25,
    marginBottom: '5%',
    marginTop: '5%',
    fontFamily: 'American Typewriter',
    fontWeight: '600'
  },
  subTitle2: {
    color: 'white',
    fontSize: 25,
    marginTop: '5%',
    fontFamily: 'American Typewriter',
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 20,
    width: '55%',
    alignItems: 'center',
    marginBottom: '5%',
  },
  errorButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 20,
    width: '75%',
    alignItems: 'center',
    marginBottom: '5%',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TourType;
