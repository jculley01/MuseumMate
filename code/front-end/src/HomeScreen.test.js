// HomeScreen.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { useNavigation } from '@react-navigation/native';

// Mock the useNavigation hook from react-navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  };
});

describe('<HomeScreen />', () => {
  it('renders correctly', () => {
    const navigationMock = { navigate: jest.fn() };
    useNavigation.mockReturnValue(navigationMock);
    
    const { getByText, getByTestId } = render(<HomeScreen />);
    
    // Check if the texts are rendered
    expect(getByText('Please Scan Your TourTag')).toBeTruthy();
    expect(getByText('Scan')).toBeTruthy();
    
    // Check if the button is clickable and it calls navigation
    const button = getByText('Scan');
    fireEvent.press(button);
    expect(navigationMock.navigate).toHaveBeenCalledWith('Scanner');
  });
});
