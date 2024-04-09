// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import BarcodeScanner from './src/BarcodeScanner';
import HomeScreen from './src/HomeScreen';
import TourType from './src/TourType';
import PreMade from './src/PreMade';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CurrectLoc from './src/CurrentLoc';
import RFIDScreen from './src/RFIDScreen'
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Sending `Exponent.speakingWillSayNextString` with no listeners registered.', 'Sending `Exponent.speakingDone` with no listeners registered.']);


const Stack = createStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: '#7574DA', // Set the background color of the header
          },
          headerTintColor: '#fff', // Set the text color of the header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Scanner"
        component={BarcodeScanner}
        options={{
          title: 'Scanner',
          headerStyle: {
            backgroundColor: '#7574DA',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="TourType"
        component={TourType}
        options={{
          title: 'Tour Type',
          headerStyle: {
            backgroundColor: '#7574DA',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="PreMade"
        component={PreMade}
        options={{
          title: 'Pre Made Tours',
          headerStyle: {
            backgroundColor: '#7574DA',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="CurrentLoc"
        component={CurrectLoc}
        options={{
          title: 'Custom',
          headerStyle: {
            backgroundColor: '#7574DA',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
        <Stack.Screen
        name="RFIDScreen"
        component={RFIDScreen}
        options={{
          title: 'Media',
          headerStyle: {
            backgroundColor: '#7574DA',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
    
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
}