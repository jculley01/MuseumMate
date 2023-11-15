import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Linking,TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

export default function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData({ type, data });
  };

  const handleConfirm = () => {
    if (scannedData && scannedData.data) {
      navigation.navigate('TourType', { scannedValue: scannedData.data });
    } else {
      alert('No scanned data to confirm');
    }
  };
  

  if (hasPermission === 'null') {
    return <Text> Requesting Camera Permission</Text>;
  }
  if (hasPermission === 'false') {
    return <Text> No Access to Camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={require('./MuseumMate.png')} style={styles.logo} />
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {scanned && (
        <Button title='Tap to Scan Again' onPress={() => setScanned(false)} color='#4f0594' />
      )}

      {scannedData && (
        <View style={styles.scannedDataContainer}>
          <Text style={styles.TTText}>TourTag:</Text>
          <Text style={styles.TTTextData} >{scannedData.data}</Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7574DA',
  },
  scannerContainer: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    borderRadius: 15,
    alignSelf: 'center',
  },
  scannedDataContainer: {
    padding: 10,
    borderRadius: 8,
    marginTop: '2%',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    marginTop: '15%',
    marginBottom: '10%',
  },
  confirmButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    marginTop:'15%',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TTText:{
    fontFamily:'Georgia',
    color: 'black',
    fontSize: 30,
  },
  TTTextData:{
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  }
});
