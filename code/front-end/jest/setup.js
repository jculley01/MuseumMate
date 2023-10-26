jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native/Libraries/EventEmitter/RCTDeviceEventEmitter', () => {
  return {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  };
});
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  jest.mock('expo-barcode-scanner');

  jest.mock('@react-navigation/native', () => {
    return {
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: jest.fn(),
    };
  });
  jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native/Libraries/Components/View/View');
    return {
      Swipeable: View,
      DrawerLayout: View,
      State: {},
      ScrollView: View,
      Slider: View,
      Switch: View,
      TextInput: View,
      ToolbarAndroid: View,
      ViewPagerAndroid: View,
      DrawerLayoutAndroid: View,
      WebView: View,
      NativeViewGestureHandler: View,
      TapGestureHandler: View,
      FlingGestureHandler: View,
      ForceTouchGestureHandler: View,
      LongPressGestureHandler: View,
      PanGestureHandler: View,
      PinchGestureHandler: View,
      RotationGestureHandler: View,
      /* etc. */
    };
  });
  
  