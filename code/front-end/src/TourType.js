import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const handleTimed = () => {
    // Placeholder for the confirm button functionality
    // You can add logic here to handle the confirmed data
    alert('TIMED TOUR!');
  };

  const handleEx = () => {
    // Placeholder for the confirm button functionality
    // You can add logic here to handle the confirmed data
    alert('Explore!');
  };



const TourType = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
         <Image
        source={require('./MuseumMate.png')}
        style={styles.logo}
      />
      <Text style={styles.subTitle}>
        Select a Tour Type
      </Text>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('PreMade')}>
        <Text style={styles.buttonText}>Timed Tour</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEx}>
        <Text style={styles.buttonText}>Explore</Text>
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
  subTitle: {
    color: 'black',
    fontSize: 25,
    marginBottom: '5%',
    marginTop:'67%',
    fontFamily:'American Typewriter',
    fontWeight:'600'
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 20,
    width: '55%',
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
