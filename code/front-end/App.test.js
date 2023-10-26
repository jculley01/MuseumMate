import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

describe('App Navigation', () => {
  
  it('renders the Home screen by default', () => {
    const { getByText } = render(<App />);
    expect(getByText('Home')).toBeTruthy();
  });

  // You can add more tests as needed

});

