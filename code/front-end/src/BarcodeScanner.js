import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function BarcodeScanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [cameraKey, setCameraKey] = useState(0); // Key state for forcing camera remount
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        let isActive = true;

        const requestPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (isActive) {
                setHasPermission(status === 'granted');
            }
        };

        if (isFocused) {
            requestPermissions();
            if (Platform.OS === 'android') {
                setCameraKey(prevKey => prevKey + 1); // Increment key to force remount
            }
        }

        return () => {
            isActive = false;
        };
    }, [isFocused]); // Depend on isFocused to re-run this effect

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setScannedData({ type, data: data.trim() });
    };

    const handleConfirm = () => {
        if (scannedData && scannedData.data) {
            navigation.navigate('TourType', { scannedValue: scannedData.data });
        } else {
            alert('No scanned data to confirm');
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}>
            <Image source={require('./MuseumMate.png')} style={styles.logo} />
        </View>;
    }
    if (hasPermission === false) {
        return <Text>No Access to Camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Image source={require('./MuseumMate.png')} style={styles.logo} />
            <View style={styles.scannerContainer}>
                <Camera
                    key={cameraKey} // Use the dynamic key
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
                    <Text style={styles.TTTextData}>{scannedData.data}</Text>
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
        marginTop: '15%',
    },
    confirmButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    TTText: {
        fontFamily: 'Georgia',
        color: 'black',
        fontSize: 30,
    },
    TTTextData: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    }
});
