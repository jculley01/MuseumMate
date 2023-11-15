import React, { useState, useEffect } from 'react';
import { View, Image, Text } from 'react-native';

// Map the numbers to the corresponding images
const images = {
  1.1: require('./img/map11.PNG'),
  1.2: require('./MuseumMate.png'),
  2.1: require('./MuseumMate.png'),
  2.2: require('./MuseumMate.png'),
  3.1: require('./MuseumMate.png'),
  3.2: require('./MuseumMate.png'),
};

function CurrentLoc({ route }) {
  const { scannedValue } = route.params;
  const [imageNumber, setImageNumber] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://museum-mate-server-necuf5ddgq-ue.a.run.app/location/${scannedValue}`);
        const data = await response.json();
        setImageNumber(data.location); // Assuming the response is the number 1-5
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [scannedValue]);

  return (
    // <View>
    //  <Text >{imageNumber}</Text>
    // </View>
    <View>
    {imageNumber && images[imageNumber]
      ? <Image source={images[imageNumber]} style={{ width: '100%', height: 200 }} />
      : <Text>Loading or no image available...</Text>
    }
  </View>
  );
}

export default CurrentLoc;
