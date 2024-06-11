import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ActivityMain = (props) => {
  const handleLiveResultsPress = () => {
    props.navigation.navigate("LIVE RESULTS");
  };

  const handleArchivalRacesPress = () => {
    props.navigation.navigate("ARCHIVAL RACES");
  };

  const handleDriversPress = () => {
    props.navigation.navigate("DRIVERS PROFILES");
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./mainScreenAssets/4.jpg')}
      />

   
      <TouchableOpacity onPress={handleLiveResultsPress} style={{ width: '100%' }}>
        <View style={styles.bar}>
          <Text style={styles.barText}>Live Results</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleArchivalRacesPress} style={{ width: '100%' }}>
        <View style={styles.bar}>
          <Text style={styles.barText}>Archival Races</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDriversPress} style={{ width: '100%' }}>
        <View style={styles.bar}>
          <Text style={styles.barText}>Drivers</Text>
        </View>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#282828',
  },
  image: {
    width: '100%',
    height: '25%',
    resizeMode: 'cover',
    marginBottom: '8%',
  },
  bar: {
    marginTop: '8%',
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  barText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
});

export default ActivityMain;