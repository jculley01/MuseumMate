// TimedToursScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';

const PreMade = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('./MuseumMate.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Timed Tours</Text>
      <TouchableOpacity style={styles.tourButton}>
        <Text style={styles.buttonText}>From Ancient Egypt to Greece (1hr)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tourButton}>
        <Text style={styles.buttonText}>Civilizations Unveiled (2hr)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tourButton}>
        <Text style={styles.buttonText}>Empires In Harmony (3hr)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tourButton}>
        <Text style={styles.buttonText}>Custom</Text>
      </TouchableOpacity>
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
  title: {
    color: 'black',
    fontSize: 30,
    marginTop: '10%',
    fontFamily:'American Typewriter',
    fontWeight:'600'
  },
  tourButton: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    width: '80%',
    height: '8%',
    alignItems: 'center',
    justifyContent:'center'
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PreMade;
