// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('./MuseumMate.png')}
        style={styles.logo}
      />
      <Text style={styles.mess}>
        Please Scan Your TourTag
      </Text>
      <TouchableOpacity style={styles.scanButton} onPress={()=>navigation.navigate('Scanner')}>
          <Text style={styles.scanButtonText}>Scan</Text> 
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7574DA',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  logo: {
    width: '100%',
    marginTop: '30%',
  },
  scanButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mess:{
    color: '#240046',
    fontSize: 20,
    marginTop:'90%',
    marginBottom:'3%',
  }
});

export default HomeScreen;
